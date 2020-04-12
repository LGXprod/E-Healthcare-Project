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
                console.log("Yes");
            } else {
                console.log("No");
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