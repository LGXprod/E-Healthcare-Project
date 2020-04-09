const showRegisterPage = (app, dir) => {
    app.get("/registration", (req, res) => {
        res.sendFile(dir + "/registration.html");
    });
}

const registerUser = (app, connection) => {
    app.post("/registration", (req, res) => {
        const body = req.body;
        console.log(body);
        const username = body.username;
        const password = body.password;

        const queryString = "select username from Patient where username='" + username + "';"
        // need to find a way to prevent sql injections

        connection.query(queryString, (err, result) => {
            if (err) {
                throw err;
            } else {
                if (result.length == 0) {
                    const addNewPatQuery = "insert into Patient (username, userPassword, fName, sName, medicareNo, medicareIRN, medicareExpiry) values "
                                            + "('" + username + "', '" + password + "', '" + body.fName + "', '" + body.sName + "', "
                                            +  body.medicareNo + ", " + body.medicareIRN + ", '" + body.medicareExpiry + "');";
                    console.log(addNewPatQuery);
                    connection.query(addNewPatQuery, (err) => {
                        if (err) {
                            throw err;
                        } else {
                            console.log("New user added.")
                        }
                    });
                    res.send("<script>alert('Your account has now been created'</script>");
                } else {
                    res.send("<script>alert('That username is unavailable'</script>");
                }
            }
        });
    });
}

module.exports = {
    showRegisterPage: showRegisterPage,
    registerUser: registerUser
}