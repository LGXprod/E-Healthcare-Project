// imports necessary models
const patient = require("../models/patient");
const doctor = require("../models/doctor");
const userDashboardController = require("./userDashboardController");

// function called that shows login page when someone access (some url (in this case localhost:3000))/
const showLoginPage = (app, dir) => {
    app.get("/", (req, res) => {
        res.sendFile(dir + "/LoginPage.html");
    });
}

// function called when a user submits their login details and gets the form data
const loginUser = (app, connection) => {
    app.post("/", (req, res) => {
        // calls a function that checks login details given by user
        // this function returns a promise as the act of acessing data in a db takes time
        // and hence cannot be done synchronously (hence async function)
        // using a promises allows the program to wait for the query to the DB to be done
        // and then get it results
        // to access the data in a promise we use .then() and .catch() to get errors
        patient.checkLoginCredentials(connection, req.body.username, req.body.password).then((correctLogin) => {

            if (correctLogin) {
                userDashboardController.showUserDashboard(res, true, req.body.username, connection);
            } else {

                // does essentially the same thing as the patient.checkLoginCredentials() but for doctors
                // POSSIBLE FUTURE CHANGE: make a user table in db and have its subtypes be patient and doctor
                // Therefore we can combine these functions together (user.checkLoginCredentials)
                // And still seperate doctor and patient data
                // ALTERNATIVE SOLUTION: create User class and have patient and doctor classes inherit it
                // If done correctly this would have the same affect as above
                doctor.checkLoginCredentials(connection, req.body.username, req.body.password).then((correctLogin) => {

                    if (correctLogin) {
                        userDashboardController.showUserDashboard(res, false, req.body.username, connection);
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

// allows other files to access variables in its object (in js you can pass functions as variables)
module.exports = {
    showLoginPage: showLoginPage,
    loginUser: loginUser
}
