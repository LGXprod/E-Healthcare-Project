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

module.exports = {
    getAppointmentsByDate: getAppointmentsByDate
}