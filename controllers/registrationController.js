const showRegisterPage = (app, dir) => {
    app.get("/registration", (req, res) => {
        res.sendFile(dir + "/registration.html");
    });
}

const registerUser = (app, connection) => {
    app.post("/registration", (req, res) => {

    });
}

module.exports = {
    showRegisterPage: showRegisterPage
}