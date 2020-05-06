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


    app.get("/DoctorDashboard", (req, res) => {
        
        res.setHeader('Cache-Control', 'no-cache, no-store');

        if (req.session.username != null) {
            doctor.getDoctorByUsername(connection, req.session.username).then((theDoctor) => {
                res.render("DoctorDashboard", {
                    username: req.session.username,
                    fName: theDoctor[0].fName,
                    sName: theDoctor[0].sName,
                    specialisation: theDoctor[0].specialisation,
                    education: theDoctor[0].education,
                    experience: theDoctor[0].experience
                });
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

        res.setHeader('Cache-Control', 'no-cache, no-store');

        if (req.session.username != null) {
            doctor.getAllDoctors(connection, "*").then((doctors) => {
                var doctorDetails = [];
    
                for (var doctor of doctors) {
                    doctorDetails.push({
                        fName: doctor.fName,
                        sName: doctor.sName,
                        details: doctor.certifications,
                        specialisation: doctor.specialisation,
                        education: doctor.education,
                        experience: doctor.experience
                    });
                }
    
                console.log(doctorDetails);
    
                res.render("OurDoctors", {
                    doctorDetails: doctorDetails
                });
            }); 
        } else {
            res.redirect("/");
        }
        
    });
}

const showDocInfoPage = (app, connection) => {
    return new Promise((resolve, reject) => {

        // get the certifications of the doctor with the above username
        // and then render that info into ejs file
        // below will have to be inside a promise to get the certifications
        app.get("/DoctorInfo", (req, res) => {
            res.setHeader('Cache-Control', 'no-cache, no-store');

            doctor.getQualifications(connection, req.session.username).then((doctors) => {
                res.render("DoctorInfo", {
                    doctorInfo: doctors[0].certifications // variable that contains the doctor's certifications
                });
            }).catch((err) => {
                console.log(err);
            });
        });
            if (err) reject(err);
            resolve(result); 
        });

}

const updateDocInfo = (app, connection) => {
    app.post("/updateDocInfo", (req, res) => {

        res.setHeader('Cache-Control', 'no-cache, no-store');

        const doc_username = req.session.username;
        const newInfo = req.body.description;

        // make a function inside the doctor model and have it replace the current info with the new info
        // I have declared this function it's called insertNewCertifications()
        // If the promise returns true then execute the below code

        doctor.insertNewCertifications(connection, doc_username, newInfo).then((doctors) => {
            res.redirect("/DoctorInfo");
        });
            
    });
    
}

module.exports = {
    showUserDashboard: showUserDashboard,
    ourDoctors: ourDoctors,
    showDocInfoPage: showDocInfoPage,
    updateDocInfo: updateDocInfo
}