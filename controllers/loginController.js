const showLoginPage = (app) => {
    app.get("/", (req, res) => {
        res.sendFile("/index.html");
    });
}

const checkLoginDetails = (app, connection) => {
    app.post("/", (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        
        var queryString = "select username from Patient where username='" + username + "' and userPassword='" + password + "';";

        connection.query(queryString, (err, result) => {
            if (err) {
                throw err;
            } else {
                if (result.length == 0) {
                    console.log("incorrect");
                } else {
                    console.log("correct");
                }
            }
        });
    });
}

module.exports = {
    showLoginPage: showLoginPage,
    checkLoginDetails: checkLoginDetails
}