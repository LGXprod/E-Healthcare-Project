const patient = require("../models/patient");
const doctor = require("../models/doctor");

const getAppointments = (app, connection) => {
    app.get("/appointmentsAvailable", (req, res) => {
        doctor.getAllDoctors(connection).then((doctors) => {
            
            doctor.getAvailableAppointments(connection, doctors[0].username, "2020-04-18").then((schedule) => {
                
            }).catch((err) => {
                console.log(err);
            });

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
    getAppointments: getAppointments
}