const patient = require("../models/patient");
const doctor = require("../models/doctor");

const showChatPage = (app, connection, io) => {
    app.get("/Chat", (req, res) => {
        const username = req.session.username;

        if (req.query.id == null) {
            doctor.getAllDoctors(connection, "*").then((doctors) => {
                res.render("PatientChat", {
                    doctors: doctors
                });
            }).catch((err) => console.log(err));
        } else {

        }
        
    });

    // app.get("/Chat", (req, res) => {
    //     const doc_username = req.session.username;
    //     const pat_username = req.query.username;

    //     patient.isUsernameAvailable(connection, pat_username).then((isNotPatient) => {
    //         if (!isNotPatient) { // if they are a registered patient

    //         } else {

    //         }
    //     }).catch((err) => console.log(err));
    // });

    io.on("connection", (socket) => {
        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
        });
    });
}

module.exports = {
    showChatPage: showChatPage
}