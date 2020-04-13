// imports necessary models
const patient = require("../models/patient");
const doctor = require("../models/doctor");

// function called that shows login page when someone access (some url (in this case localhost:3000))/
const showLoginPage = (app, dir) => {
    app.get("/", (req, res) => {
        res.sendFile(dir + "/LoginPage.html");
    });
}

// function called when a user submits their login details and gets the form data
const loginUser = (app, connection, dir) => {
    app.post("/", (req, res) => {
        // calls a function that checks login details given by user
        // this function returns a promise as the act of acessing data in a db takes time
        // and hence cannot be done synchronously (hence async function)
        // using a promises allows the program to wait for the query to the DB to be done
        // and then get it results
        // to access the data in a promise we use .then() and .catch() to get errors
        patient.checkLoginCredentials(connection, req.body.username, req.body.password).then((correctLogin) => {

            if (correctLogin) {
                showUserDashboard(res, true, req.body.username, connection, dir);
            } else {

                // does essentially the same thing as the patient.checkLoginCredentials() but for doctors
                // POSSIBLE FUTURE CHANGE: make a user table in db and have its subtypes be patient and doctor
                // Therefore we can combine these functions together (user.checkLoginCredentials)
                // And still seperate doctor and patient data
                // ALTERNATIVE SOLUTION: create User class and have patient and doctor classes inherit it
                // If done correctly this would have the same affect as above
                doctor.checkLoginCredentials(connection, req.body.username, req.body.password).then((correctLogin) => {

                    if (correctLogin) {
                        showUserDashboard(res, false, body.username, connection, dir);
                    } else {
                        res.send("<script>alert('Wrong login details');history.go(-1);</script>");
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

// displays a user's dashboard using ejs (HTML templating)
function showUserDashboard(res, isPatient, username, connection, dir) {
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

// allows other files to access variables in its object (in js you can pass functions as variables)
module.exports = {
    showLoginPage: showLoginPage,
    loginUser: loginUser
}
