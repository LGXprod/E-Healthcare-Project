const showLoginPage = (app) => {
    app.get("/", (req, res) => {
        res.sendFile("/index.html");
    });
}

const checkLoginDetails = (app) => {
    app.post("/", (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        
        res.send("<script>alert('Successfully logged in')</script>");
    });
}

module.exports = {
    showLoginPage: showLoginPage,
    checkLoginDetails: checkLoginDetails
}