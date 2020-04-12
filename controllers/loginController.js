const patient = require("../models/patient");
const doctor = require("../models/doctor");

const showLoginPage = (app, dir) => {
    app.get("/", (req, res) => {
        res.sendFile(dir + "/LoginPage.html");
    });
}

const loginUser = (app, connection, dir) => {
    app.post("/", (req, res) => {
        patient.checkLoginCredentials(connection, req.body.username, req.body.password).then((correctLogin) => {

            if (correctLogin) {
                showUserDashboard(res, true, req.body.username, connection, dir);
            } else {

                doctor.checkLoginCredentials(connection, req.body.username, req.body.password).then((correctLogin) => {

                    if (correctLogin) {
                        showUserDashboard(res, false, body.username, connection, dir);
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

function showUserDashboard(res, isPatient, username, connection, dir) {
    if (isPatient) {

        patient.getPatByUsername(connection, username).then((patient) => {
            if (patient == null) {
                res.send("<script>alert('Could not find unique user. Please contact admin.')</script>");
            } else {
                res.render("PatientDashboard", {
                    username: patient.username,
                    fName: patient.fName,
                    sName: patient.sName,
                    medicareNo: patient.medicareNo,
                    medicareIRN: patient.medicareIRN,
                    medicareExpiry: patient.medicareExpiry
                });
            }
        }).catch((err) => {
            console.log(err);
        });

    } else {
        res.render("DoctorDashboard", {
            username: "fwef",
            fName: "fwefwe",
            sName: "gefbe"
        });
    }
}

module.exports = {
    showLoginPage: showLoginPage,
    loginUser: loginUser
}