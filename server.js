require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mySQL = require("mysql");

const loginController = require("./controllers/loginController.js");

const connection = mySQL.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "eHealthDB"
});

connection.connect(function(err) {
    if (err) throw err;

    console.log("Successfully connected to DB");
})

const ehealthApp = express();

ehealthApp.use(bodyParser.urlencoded({extended: true}));

ehealthApp.listen(3000, () => {
    console.log("Node server started on port 3000");
});

ehealthApp.use(express.static(__dirname + "/public"));

loginController.showLoginPage(ehealthApp);
loginController.checkLoginDetails(ehealthApp, connection);