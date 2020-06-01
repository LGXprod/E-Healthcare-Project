const patient = require("../models/patient");
const doctor = require("../models/doctor");

const showUrgentCasesPage = (app, connection) => {

	app.get("/UrgentCases", (req, res) => {
		res.render("UrgentCases");
	});

	app.get("/Emergency", (req, res) => {

		res.setHeader('Cache-Control', 'no-cache, no-store');

		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0');
		var yyyy = today.getFullYear();
		var hour = String(today.getHours()).padStart(2, '0');
		var min = String(today.getMinutes()).padStart(2, '0');
		var sec = String(today.getSeconds()).padStart(2, '0');

		today = yyyy + '-' + mm + '-' + dd; // change back to mm plus dd
		time = hour + ":" + min + ":" + sec;

		console.log("/UrgentChat?date=" + today + "&time=" + time);
		res.redirect("/UrgentChat?date=" + today + "&time=" + time);

	});

	app.get("/IsEmergency", (req, res) => {

		const username = req.session.username;

		doctor.getDoctorByUsername(connection, username).then((docInfo) => {
			if (docInfo.length == 1) {
				doctor.getEmergencyByDoc(connection, username).then((pat) => {
					doctor.emergencyHandled(connection, pat.pat_username).then(() => {
                        if (pat.name != null) {
							res.send({
								isEmergency: true,
								name: pat.name
							});
						} else {
							res.send({
								isEmergency: false,
								name: null
							});
						}
					}).catch(err => console.log(err));
					
				}).catch(err => console.log(err));
			} 
		}).catch(err => console.log(err));

	});

}

module.exports = {
    showUrgentCasesPage: showUrgentCasesPage
}