// accesses a file that doesn't get uploaded to github so you can put your computer password or other necessary, sensitive data in there
require("dotenv").config();
// accessing packages downloaded from npm
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mySQL = require("mysql");
const mySQLStore = require("express-mysql-session")(session);

const ehealthApp = express(); // creates express app so we can use its http middleware functions
const server = require("http").createServer(ehealthApp);
const io = require("socket.io").listen(server);

// importing testing and sample data modules
const insertRandomData = require("./testing/insertRandomData");
const testUrgentCases = require("./testing/testUrgentCasesTable");
const testChat = require("./testing/testChatTable");

// importing controllers
const loginController = require("./controllers/loginController");
const registrationController = require("./controllers/registrationController");
const schedulingController = require("./controllers/schedulingController");
const userDashboardController = require("./controllers/userDashboardController");
const chatController = require("./controllers/chatController");
const urgentController = require("./controllers/urgentController");

// uses mysql package to create connection to mysql server
const connection = mySQL.createConnection({
    host: "localhost",
    user: "root", // my username in mysql workbench is root
    password: process.env.DB_PASSWORD, // accesses the local env file and gets the password which is store in the DB_PASSWORD
    database: "eHealthDB"
});

 //uses connection to connect to the mysql ehealth db

const sessionStore = new mySQLStore({
    createDatabaseTable: true,
    expiration: 3600000,
    checkExpirationInterval: 10000,
    endConnectionOnClose: true,
    schema: {
		tableName: 'sessions',
		columnNames: {
			session_id: 'session_id',
			expires: 'expires',
			data: 'data'
		}
    }
}, connection);

// uses connection to connect to the mysql ehealth db
connection.connect(function(err) {
    if (err) throw err;

    console.log("Successfully connected to DB");
});

// generates 10 rows in the Patient table using simulated data from the faker package
//  for (var i=1; i<=10; i++) {
//      insertRandomData.addPatData(connection);
//      console.log("");
//  }


// adds a year's worth of dates and times to a doctors availability
//  for (var i=1; i<=5; i++) {
//      insertRandomData.addDocData(connection);
//   }

// adds a year's worth of dates and times to a doctors availability
//  insertRandomData.addAvailabilityData(connection);

// generates 10 rows in the Valid_Provider_No table using simulated data from the faker package
//  for (var i=1; i<=10; i++) {
//      insertRandomData.addProviderNo(connection);
//   }

// insertRandomData.addOtherDoctorInfo(connection);

// testChat.loadTest(connection);
// testUrgentCases.loadTest(connection);

// insertRandomData.addRandomChatData(connection);

ehealthApp.use(session({
    secret: 'ssshhhhh',
    store: sessionStore,
    resave: false,
	saveUninitialized: false
}));

ehealthApp.use(bodyParser.urlencoded({extended: true})); // encodes data passed from forms
ehealthApp.use(express.static(__dirname + "/public")); // allows html/ejs files to only reference the relative file path 

ehealthApp.set("view engine", "ejs"); // uses ejs for templating so we can change html depending on the data the server finds/generates

// checks if http requests/responses are being sent to port 3000 on localhost
// ehealthApp.listen(3000, () => {
//     console.log("Node server started on port 3000");
// });

server.listen(3000, () => console.log("Starting server on port 3000"));

const views_dir = __dirname + "/views";

// calls functions in controller modules
loginController.showLoginPage(ehealthApp, views_dir);
loginController.loginUser(ehealthApp, connection);
loginController.logoutUser(ehealthApp);

registrationController.showRegisterPage(ehealthApp, views_dir);
registrationController.registerUser(ehealthApp, connection);
registrationController.registerDoctor(ehealthApp, connection);

schedulingController.getAppointmentsByDate(ehealthApp, connection);
schedulingController.showBookingPage(ehealthApp, connection);
schedulingController.doctorViewAppointments(ehealthApp, connection);
schedulingController.bookAppointment(ehealthApp, connection);
schedulingController.removeAppointment(ehealthApp, connection);

userDashboardController.showUserDashboard(ehealthApp, connection);
userDashboardController.ourDoctors(ehealthApp, connection);
userDashboardController.showDocInfoPage(ehealthApp, connection);
userDashboardController.updateDocInfo(ehealthApp, connection);

chatController.showChatPage(ehealthApp, connection, io);
chatController.existingChats(ehealthApp, connection);
chatController.denyAccess(ehealthApp, ehealthApp, views_dir);

urgentController.showUrgentCasesPage(ehealthApp, connection);