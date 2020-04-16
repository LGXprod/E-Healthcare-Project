const patient = require("../models/patient");
const doctor = require("../models/doctor");

const showBookingPage = (app) => {
    app.get("/booking", (req, res) => {
        res.render("BookingMenu");
    });
}

const getAvailableAppointments = (app, connection) => {
    app.get("/appointmentsAvailable", (req, res) => {
        doctor.getAllDoctors(connection).then((doctors) => {
            
        }).catch((err) => {
            console.log(err);
        })

        res.json({});
    });
}

module.exports = {
    getAvailableAppointments: getAvailableAppointments
}