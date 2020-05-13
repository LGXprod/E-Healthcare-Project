const crypto = require('crypto');

const patient = require("../models/patient");
const doctor = require("../models/doctor");
const chat = require("../models/chat");

const showChatPage = (app, connection, io) => {

    io.on("connection", (socket) => {
        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
            io.emit('chat message', msg);
        });
    });

    app.get("/Chat", (req, res) => {

        const username = req.session.username;
        const chat_id = req.query.id;

        if (chat_id == null) {
            // doctor.getAllDoctors(connection, "*").then((doctors) => {
            //     res.render("PatientChat", {
            //         doctors: doctors
            //     });
            // }).catch((err) => console.log(err));
        } else {
            
            function showPage() {
                doctor.getAllDoctors(connection, "*").then((doctors) => {
                    res.render("DoctorChat", {
                        doctors: doctors
                    });
                }).catch((err) => console.log(err));
            }

            function checkAgainstChatID(isPatient) {
                chat.getChatByID(connection, chat_id, isPatient, username).then((chatData) => {
                    if (!(chatData.length == 1)) {
                        socket.on("disconnect", () => {
                            console.log("Disconnected unauthorized user");
                        });
                    } 
                }).catch((err) => console.log(err));
            }

            patient.getPatByUsername(connection, username).then((thePatient) => {
                if (thePatient != null) {
                    showPage();
                    checkAgainstChatID(true);
                } else {
                    doctor.getDoctorByUsername(connection, username).then((theDoctor) => {
                        if (theDoctor.length == 1) {
                            showPage();
                            checkAgainstChatID(false);
                        } else {
                            res.redirect("/DeniedAccess");
                        }
                    }).catch((err) => console.log(err));
                }
            }).catch((err) => console.log(err));
            
        }
        
    });

    app.get("/StartChat", (req, res) => {
        const date = req.query.date;
        const time = req.query.time;
        const username = req.session.username;

        patient.getPatientByTime(connection, date, time).then((pat_username) => {
            const buf = crypto.randomBytes(16);
            const chat_id = `${buf.toString('hex')}`;

            chat.isChatIDAvaliable(connection, chat_id).then((idAvailable) => {
                if (idAvailable) {
                    console.log("x " + pat_username);
                    chat.createNewChat(connection, chat_id, pat_username, username).then().catch((err) => console.log(err));
                    res.redirect("/Chat?id=" + chat_id);
                } else {
                    // handle generating an existing chat_id
                }
            }).catch((err) => console.log(err));

        }).catch((err) => console.log(err));

        
    });

}

const existingChats = (app, connection) => {

    app.get("/Chats", (req, res) => {

        if (req.session) {
            chat.getChatByPatient(connection, req.session.username).then((chats) => {
                res.render("ChatList", chats);
            }).catch((err) => console.log(err));
        }

    });

}

const denyAccess = (app, connection, dir) => {

    app.get("/DeniedAccess", (req, res) => {
        res.sendFile(dir + "/DeniedAccess.html");
    });

}

module.exports = {
    showChatPage: showChatPage,
    existingChats: existingChats,
    denyAccess: denyAccess
}