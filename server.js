require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mySQL = require("mysql");

// importing testing and sample data modules
const insertRandomData = require("./testing/insertRandomData");

// importing controllers
const loginController = require("./controllers/loginController");
const registrationController = require("./controllers/registrationController")

const connection = mySQL.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "eHealthDB"
});

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

const ehealthApp = express();
ehealthApp.use(bodyParser.urlencoded({extended: true}));
ehealthApp.use(express.static(__dirname + "/public"));

ehealthApp.listen(3000, () => {
    console.log("Node server started on port 3000");
});

const views_dir = __dirname + "/views";

loginController.showLoginPage(ehealthApp, views_dir);
loginController.checkLoginDetails(ehealthApp, connection, views_dir);

registrationController.showRegisterPage(ehealthApp, views_dir);
registrationController.registerUser(ehealthApp, connection);