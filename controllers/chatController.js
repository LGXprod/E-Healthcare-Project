const http = require("http");
const crypto = require('crypto');

const patient = require("../models/patient");
const doctor = require("../models/doctor");
const chat = require("../models/chat");

const showChatPage = (app, connection, io) => {

    io.on("connection", (socket) => {
        socket.on('chat message', (msg) => {
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
            
            function showPage(isPatient, req_fName, req_sName, resName) {
                if (isPatient) {
                    res.render("PatientChat", {
                        name: req_fName + " " + req_sName,
                        resName: resName
                    });
                } else {
                    res.render("DoctorChat", {
                        name: req_fName + " " + req_sName,
                        resName: resName
                    });
                }
            }

            function checkAgainstChatID(isPatient) {
                chat.getChatByID(connection, chat_id, isPatient, username).then((chatData) => {
                    if (chatData.length == 1) {
                        doctor.getDoctorByUsername(connection, chatData[0].doc_username).then((docData) => {
                            patient.getPatByUsername(connection, chatData[0].pat_username).then((patData) => {
                               if (isPatient) {
                                   showPage(true, docData[0].fName, docData[0].sName, patData.fName + " " + patData.sName);
                               } else {
                                   showPage(false, patData.fName, patData.sName, docData[0].fName + " " + docData[0].sName);
                               }
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    } else {
                        socket.on("disconnect", () => {
                            console.log("Disconnected unauthorized user");
                        });
                        res.redirect("/DeniedAccess");
                    }
                }).catch((err) => console.log(err));
            }

            patient.getPatByUsername(connection, username).then((thePatient) => {
                if (thePatient != null) {
                    checkAgainstChatID(true);
                } else {
                    doctor.getDoctorByUsername(connection, username).then((theDoctor) => {
                        if (theDoctor.length == 1) {
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
                    chat.createNewChat(connection, chat_id, pat_username, username).then().catch((err) => console.log(err));
                    res.redirect("/Chat?id=" + chat_id);
                } else {
                    // handle generating an existing chat_id
                }
            }).catch((err) => console.log(err));

        }).catch((err) => console.log(err));
        
    });

    // needs front end
    app.get("/UrgentChat", (req, res) => {

        const date = req.query.date;
        const time = req.query.time;
        const username = req.session.username;

        if (req.session) {
            patient.getPatByUsername(connection, username).then((thePatient) => {
                if (thePatient != null) {
                    
                } else {
                    res.redirect("/DeniedAccess");
                }
            }).catch((err) => console.log(err));
        } else {
            res.redirect("/DeniedAccess");
        }


    });

    // needs front end
    app.post("/SaveMessage", (req, res) => {

        const message = req.body.message;
        const isPatient = req.body.isPatient;
        const chat_id = req.body.chat_id;

        console.log(message);
        console.log(isPatient);
        console.log(chat_id);

        chat.saveChatMessage(connection, chat_id, message, isPatient);

    });

    // needs front end
    app.get("/PreviousMessages", (req, res) => {

        const username = req.session.username;
        const chat_id = req.query.id;

        patient.isUsernameAvailable(connection, username).then((notPatient) => {
            if (notPatient) {
                chat.getChatByID(connection, chat_id, false, username).then((theChat) => {
                    res.send(theChat[0].patient_text);
                });
            } else {
                chat.getChatByID(connection, chat_id, true, username).then((theChat) => {
                    res.send(theChat[0].patient_text);
                });
            }
        }).catch(err => console.log(err));
    });

}

// needs front end
const existingChats = (app, connection) => {

    app.get("/Chats", (req, res) => {

        if (req.session) {
            chat.getChatByPatient(connection, req.session.username).then((chats) => {
                res.render("ChatList", {
                    chats: chats
                });
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