const showRegisterPage = (app, dir) => {
    app.get("/registration", (req, res) => {
        res.sendFile(dir + "/registration.html");
    });
}

const registerUser = (app, connection) => {
    app.post("/registration", (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        const queryString = "select username from Patient where username='" + username + "';"
        // need to find a way to prevent sql injections

        connection.query(queryString, (err, result) => {
            if (err) {
                throw err;
            } else {
                if (result.length == 0) {
                    connection.query("insert into Patient (username, userPassword)")
                    res.send("<script>alert('Your account has now been created'</script>");
                } else {
                    res.send("<script>alert('That username is unavailable'</script>");
                }
            }
        });
    });
}

module.exports = {
    showRegisterPage: showRegisterPage
}