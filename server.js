// accesses a file that doesn't get uploaded to github so you can put your computer password or other necessary, sensitive data in there
require("dotenv").config();
// accessing packages downloaded from npm
const express = require("express");
const bodyParser = require("body-parser");
const mySQL = require("mysql");

// importing testing and sample data modules
const insertRandomData = require("./testing/insertRandomData");

// importing controllers
const loginController = require("./controllers/loginController");
const registrationController = require("./controllers/registrationController");

// uses mysql package to create connection to mysql server
const connection = mySQL.createConnection({
    host: "localhost",
    user: "root", // my username in mysql workbench is root
    password: process.env.DB_PASSWORD, // accesses the local env file and gets the password which is store in the DB_PASSWORD
    database: "eHealthDB"
});

// uses connection to connect to the mysql ehealth db
connection.connect(function(err) {
    if (err) throw err;

    console.log("Successfully connected to DB");
});

// generates 10 rows in the Patient table using simulated data from the faker package

// for (var i=1; i<=10; i++) {
//     insertRandomData.addPatData(connection);
//     console.log("");
// }

// generates 10 rows in the Doctor table using simulated data from the faker package

// for (var i=1; i<=5; i++) {
//     insertRandomData.addDocData(connection);
// }

const ehealthApp = express(); // creates express app so we can use its http middleware functions

ehealthApp.use(bodyParser.urlencoded({extended: true})); // encodes data passed from forms
ehealthApp.use(express.static(__dirname + "/public")); // allows html/ejs files to only reference the relative file path 

ehealthApp.set("view engine", "ejs"); // uses ejs for templating so we can change html depending on the data the server finds/generates

// checks if http requests/responses are being sent to port 3000 on localhost
ehealthApp.listen(3000, () => {
    console.log("Node server started on port 3000");
});

const views_dir = __dirname + "/views";

// calls functions in controller modules
loginController.showLoginPage(ehealthApp, views_dir);
loginController.loginUser(ehealthApp, connection);

registrationController.showRegisterPage(ehealthApp, views_dir);
registrationController.registerUser(ehealthApp, connection);