const patient = require("../models/patient");

const showLoginPage = (app, dir) => {
    app.get("/", (req, res) => {
        res.sendFile(dir + "/LoginPage.html");
    });
}

const checkLoginDetails = (app, connection) => {
    app.post("/", (req, res) => {
        patient.checkLoginCredentials(connection, req.body.username, req.body.password).then((correctLogin) => {
            console.log(correctLogin);

            if (correctLogin) {
                res.sendFile("/PatientDashboard.html");
            } else {
                
            }
        }).catch((err) => {
            throw err;
        });
    });
}

module.exports = {
    showLoginPage: showLoginPage,
    checkLoginDetails: checkLoginDetails
}