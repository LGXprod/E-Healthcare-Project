const patient = require("../models/patient");
const doctor = require("../models/doctor");

const showLoginPage = (app, dir) => {
    app.get("/", (req, res) => {
        res.sendFile(dir + "/LoginPage.html");
    });
}

const checkLoginDetails = (app, connection, dir) => {
    app.post("/", (req, res) => {
        patient.checkLoginCredentials(connection, req.body.username, req.body.password).then((correctLogin) => {

            if (correctLogin) {
                res.sendFile(dir + "/PatientDashboard.html");
            } else {

                doctor.checkLoginCredentials(connection, req.body.username, req.body.password).then((correctLogin) => {

                    if (correctLogin) {
                        res.sendFile(dir + "/DoctorDashboard.html");
                    } else {
                        res.send("<script>alert('Wrong login details')</script>");
                    }

                }).catch((err) => {
                    console.log("Error");
                    throw err;
                });

            }
        }).catch((err) => {
            console.log("Error");
            throw err;
        });

    });
}

module.exports = {
    showLoginPage: showLoginPage,
    checkLoginDetails: checkLoginDetails
}