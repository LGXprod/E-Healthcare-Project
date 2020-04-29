const patient = require("../models/patient");
const doctor = require("../models/doctor");

async function getDoctorSchedule(connection, theDoctor, date) {
    return new Promise((resolve, reject) => {
        doctor.getAvailableAppointments(connection, theDoctor.username, date).then((schedule) => { // getting the promise from getAvailableAppointments()
            resolve(schedule);
        }).catch((err) => {
            reject(err);
        });
    });
}

// this function will be called by the client side js to get the appointments via ajax (so it can be updated regularly)
const getAppointmentsByDate = (app, connection) => {
    app.get("/appointmentsAvailable", (req, res) => {

        doctor.getAllDoctors(connection, "username, fName, sName").then(async (doctors) => { // getting the promise from getAllDoctors()
            var doctorTimes = [];

            for (var theDoctor of doctors) {
                const schedule = await getDoctorSchedule(connection, theDoctor, req.query.date);
                doctorTimes.push({fName: theDoctor.fName, sName: theDoctor.sName, schedule: schedule});
            }

            res.json(doctorTimes);

        }).catch((err) => {
            console.log(err);
        });

    });

}

const showBookingPage = (app, connection) => {
    app.get("/booking", (req, res) => {

        res.setHeader('Cache-Control', 'no-cache, no-store');

        if (req.session.username != null) {
            doctor.getAllDoctors(connection, "fName, sName").then((doctors) => {
                res.render("Booking", {
                    doctors: doctors
                });
            }).catch((err) => {
                console.log(err);
            });
        } else {
            res.redirect("/");
        }
        
    });
}

const bookAppointment = (app, connection) => {
    app.post("/newAppointment", (req, res) => {
        var date = req.body.date; // date in mysql includes time
        var pat_username = req.session.username;
        var doc_username = req.body.doc_username; //name for input in HTML form

        patient.insertNewAppointmentToSchedule(connection, pat_username, doc_username, date);
        // call a function to query the database to save that appointment in schedule
    });
}

const removeAppointment = (app, connection) => {
    app.post("/removeAppointment", (req, res) => {
        var date = req.body.date; // date in mysql includes time
        var pat_username = req.session.username;
        var doc_username = req.body.doc_username; //name for input in HTML form

        patient.deleteAppointmentFromSchedule(connection, pat_username, doc_username, date);
    });
}

module.exports = {
    getAppointmentsByDate: getAppointmentsByDate,
    showBookingPage: showBookingPage,
    bookAppointment: bookAppointment,
    removeAppointment: removeAppointment
}