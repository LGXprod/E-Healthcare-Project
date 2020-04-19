const patient = require("../models/patient");
const doctor = require("../models/doctor");

// this function will be called by the client side js to get the appointments via ajax (so it can be updated regularly)
const getAppointmentsByDate = (app, connection) => {
    app.get("/appointmentsAvailable", (req, res) => {

        doctor.getAllDoctors(connection).then((doctors) => { // getting the promise from getAllDoctors()
            
            for (var theDoctor of doctors) {
                doctor.getAvailableAppointments(connection, theDoctor.username, "2020-03-18").then((schedule) => { // getting the promise from getAvailableAppointments()
                    console.log(schedule);
                }).catch((err) => {
                    console.log(err);
                });
            }

        }).catch((err) => {
            console.log(err);
        })

        res.json({});
    });

}

const showBookingPage = (app, connection) => {
    app.get("/booking", (req, res) => {
        getAppointments(app, connection);
        res.render("BookingMenu");
    });
}

const bookAppointment = (app, connection) => {
    app.post("/newAppointment", (req, res) => {
        var date = req.body.date; // date in mysql includes time
        var pat_username = req.body.pat_username; //name for input in HTML form
        var doc_username = req.body.doc_username; //name for input in HTML form

        patient.insertNewAppointmentToSchedule(connection, pat_username, doc_username, date);
        // call a function to query the database to save that appointment in schedule
    });
}

const removeAppointment = (app, connection) => {
    app.post("/removeAppointment", (req, res) => {
        var date = req.body.date; // date in mysql includes time
        var pat_username = req.body.pat_username; //name for input in HTML form
        var doc_username = req.body.doc_username; //name for input in HTML form

        patient.deleteAppointmentFromSchedule(connection, pat_username, doc_username, date);
    });
}

module.exports = {
    getAppointmentsByDate: getAppointmentsByDate,
    bookAppointment: bookAppointment,
    removeAppointment: removeAppointment
}