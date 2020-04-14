const patient = require("../models/patient");

// displays a user's dashboard using ejs (HTML templating)
function showUserDashboard(res, isPatient, username, connection) {
    if (isPatient) {

        patient.getPatByUsername(connection, username).then((patient) => {
            if (patient == null) {
                res.send("<script>alert('Could not find unique user. Please contact admin.')</script>");
            } else {
                // sends an ejs file and loads variables stored in the object below, where designated (check PatientDashboard.ejs)
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
    showUserDashboard: showUserDashboard
}