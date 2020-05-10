const patient = require("./patient");
const doctor = require("./doctor");

const getChatByID = (connection, chat_id, isPatient, username) => {
    return new Promise((resolve, reject) => {

        let usernameType;

        if (isPatient) {
            usernameType = "pat_username";
        } else {
            usernameType = "doc_username";
        }

        const queryString = "select * from chat where url='" + chat_id + "' and " + usernameType + "='" + username + "';";

        connection.query(queryString, (err, chat) => {
            if (err) reject(err);

            resolve(chat);
        });
    });
}

const getPatientAppointment = (connection, date, time, doc_username) => {
    return new Promise((resolve, reject) => {

    });
}

module.exports = {
    getChatByID: getChatByID
}