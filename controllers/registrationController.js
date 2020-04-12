const patient = require("../models/patient");

const showRegisterPage = (app, dir) => {
    app.get("/registration", (req, res) => {
        res.sendFile(dir + "/registration.html");
    });
}

const registerUser = (app, connection) => {
    app.post("/registration", (req, res) => {
        const body = req.body;
        const username = body.username;
        const password = body.password;

        patient.isUsernameAvailable(connection, username).then((isAvailable) => {
            console.log(isAvailable);

            if (isAvailable) {
                
                patient.insertNewPatDB(connection, body, username, password).then((successfulInsert) => {

                    if (successfulInsert) {
                        console.log("New patient added");
                    } else {
                        console.log("Did not add new patient (FIX)");
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

module.exports = {
    showRegisterPage: showRegisterPage,
    registerUser: registerUser
}