const patient = require("../models/patient");
const doctor = require("../models/doctor");

const showUrgentCasesPage = (app, connection) => {

	app.post("/Emergency", (req, res) => {

		res.setHeader('Cache-Control', 'no-cache, no-store');

		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0');
		var yyyy = today.getFullYear();
		var hour = String(today.getHours()).padStart(2, '0');
		var min = String(today.getMinutes()).padStart(2, '0');
		var sec = String(today.getSeconds()).padStart(2, '0');

		today = yyyy + '-' + mm + '-' + dd; 
		time = hour + ":" + min + ":" + sec;

		console.log(today + " " + time);

		res.redirect("/UrgentChat?date=" + today + "&time=" + time)
    });

}

const getUrgentCases = (app, connection) => {

}

module.exports = {
    showUrgentCasesPage: showUrgentCasesPage,
    getUrgentCases: getUrgentCases
}