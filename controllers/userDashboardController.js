const patient = require("../models/patient");
const doctor = require("../models/doctor");

// displays a user's dashboard using ejs (HTML templating)
// function showUserDashboard(res, isPatient, username, connection, req) {
//     if (isPatient) {

//         patient.getPatByUsername(connection, username).then((patient) => {
//             if (patient == null) {
//                 res.send("<script>alert('Could not find unique user. Please contact admin.')</script>");
//             } else {
//                 // sends an ejs file and loads variables stored in the object below, where designated (check PatientDashboard.ejs)
//                 res.render("PatientDashboard", {
//                     username: patient.username,
//                     fName: patient.fName,
//                     sName: patient.sName,
//                     medicareNo: patient.medicareNo,
//                     medicareIRN: patient.medicareIRN,
//                     medicareExpiry: patient.medicareExpiry
//                 });
//             }
//         }).catch((err) => {
//             console.log(err);
//         });

//     } else {

//         doctor.getDoctorByUsername(connection, username).then((theDoctor) => {
//             res.render("DoctorDashboard", {
//                 username: username,
//                 fName: theDoctor[0].fName,
//                 sName: theDoctor[0].sName
//             });
//         }).catch((err) => {
//             console.log(err);
//         });
 
//     }
// }

function showUserDashboard(app, connection) {
    app.get("/PatientDashboard", (req, res) => {

        res.setHeader('Cache-Control', 'no-cache, no-store');

        if (req.session.username != null) {
            patient.getPatByUsername(connection, req.session.username).then((patient) => {
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
            res.redirect("/");
        }

    });
}

// show the webpage with the doctor's about me and qualifications
const ourDoctors = (app, connection) => {
    app.get("/OurDoctors", (req, res) => {
        doctor.getAllDoctors(connection, "fName, sName, certifications").then((doctors) => {
            var doctorDetails = [];

            for (var doctor of doctors) {
                doctorDetails.push({
                    fName: doctor.fName,
                    sName: doctor.sName,
                    details: doctor.certifications
                });
            }

            console.log(doctorDetails);

            res.render("OurDoctors", {
                doctorDetails: doctorDetails
            });
        }); 
    });
}

module.exports = {
    showUserDashboard: showUserDashboard,
    ourDoctors: ourDoctors
}