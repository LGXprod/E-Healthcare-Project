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

const isChatIDAvaliable = (connection, chat_id) => {
    return new Promise((resolve, reject) => {
        connection.query("select url from chat where url='" + chat_id + "';", (err, chat_id) => {
            if (err) reject(err);

            if (chat_id.length == 1) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

const createNewChat = (connection, chat_id, pat_username, doc_username) => {
    return new Promise((resolve, reject) => {
        const queryString = "insert into chat (pat_username, doc_username, appointmentTable) values ('"
                            + pat_username + "', '" + doc_username + "', '" + chat_id + "');"

        connection.query(queryString, (err) => {
            if (err) reject(err);
        });
    });
}

const getPatientAppointment = (connection, date, time, doc_username) => {
    return new Promise((resolve, reject) => {

    });
}

module.exports = {
    getChatByID: getChatByID,
    isChatIDAvaliable, isChatIDAvaliable,
    createNewChat: createNewChat
}