const express = require("express");
const bodyParser = require("body-parser");

const loginController = require("./controllers/loginController.js");

const ehealthApp = express();

ehealthApp.listen(3000, ()=>{
    console.log(":)");
});

ehealthApp.use(express.static(__dirname + "/public"));

loginController.showLoginPage(ehealthApp);