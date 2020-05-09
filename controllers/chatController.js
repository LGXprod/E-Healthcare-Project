const patient = require("../models/patient");
const doctor = require("../models/doctor");

const showChatPage = (app, connection, io) => {
    app.get("/Chat", (req, res) => {
        const username = req.session.username;

        doctor.getAllDoctors(connection, "*").then((doctors) => {
            res.render("PatientChat", {
                doctors: doctors
            });
        }).catch((err) => console.log(err));
    });

    io.on("connection", (socket) => {
        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
        });
    });
}

module.exports = {
    showChatPage: showChatPage
}