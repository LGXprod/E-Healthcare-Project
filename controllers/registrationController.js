const patient = require("../models/patient");
const userDashboardController = require("./userDashboardController");

// sends registration.html to /registration
const showRegisterPage = (app, dir) => {
    app.get("/registration", (req, res) => {
        res.sendFile(dir + "/registration.html");
    });
}

// gets data from a form that's action="/registration"
const registerUser = (app, connection) => {
    app.post("/UserRegistration", (req, res) => {
        const body = req.body;
        const username = body.username; // accesses variables form object (req.body) and gets a specific property from it (username) (this is the name of the input in the form)
        const password = body.password;

        // calls async function to check if username is available
        patient.isUsernameAvailable(connection, username).then((isAvailable) => {
            console.log(isAvailable);

            if (isAvailable) {
                
                patient.insertNewPatDB(connection, body, username, password).then((successfulInsert) => {

                    if (successfulInsert) {
                        req.session.username = req.body.username;
                        res.redirect("/PatientDashboard");
                    } else {
                        res.send("<script>alert('An error occurred. Please refresh page and try again')</script>");
                    }

                }).catch((err) => {
                    console.log(err);
                });

            } else {
                res.send("<script>alert('That username is not available')</script>");
            }
            
        }).catch((err) => {
            console.log(err);
        });
    });
}

const registerDoctor = (app, connection) => {
    app.post("/DoctorRegisteration", (req, res) => {
        
    });
}

module.exports = {
    showRegisterPage: showRegisterPage,
    registerUser: registerUser
}