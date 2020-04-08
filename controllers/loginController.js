const showLoginPage = (app) => {
    app.get("/", (req, res)=>{
        res.sendFile("/index.html");
    });
}

module.exports = {
    showLoginPage: showLoginPage
}