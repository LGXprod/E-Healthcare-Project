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
        const queryString = "insert into chat (pat_username, doc_username, url) values ('"
                            + pat_username + "', '" + doc_username + "', '" + chat_id + "');"

        connection.query(queryString, (err) => {
            if (err) reject(err);

            resolve();
        });
    });
}

const getChatByPatient = (connection, username) => {
    return new Promise((resolve, reject) => {
        const queryString = "select chat.url as url, doctor.fName as fName, doctor.sName as sName from chat left join doctor on chat.doc_username=doctor.username " + 
                            "where pat_username='" + username + "';"
                            

        connection.query(queryString, (err, chats) => {
            if (err) reject(err);

            resolve(chats);
        });
    });
}

const getChatByDoc = (connection, username) => {
    return new Promise((resolve, reject) => {
        const queryString = "select chat.url as url, patient.fName as fName, patient.sName as sName from chat left join patient on chat.pat_username=patient.username " + 
                            "where doc_username='" + username + "';"
                            
        connection.query(queryString, (err, chats) => {
            if (err) reject(err);

            resolve(chats);
        });
    });
}

const saveChatMessage = (connection, chat_id, message, isPatient) => {
    const getPrevChat = "select * from chat where url ='" + chat_id + "';";

    // we are going to store all message in patient_text
    connection.query(getPrevChat, (err, chat) => {
        if (err) throw err;

        var messages = [];

        if (chat[0].patient_text != null) {
            messages = JSON.parse(chat[0].patient_text);
            console.log(messages);
            messages.push({
                msg: message,
                isPatient: isPatient
            });
        } else {
            messages.push({
                msg: message,
                isPatient: isPatient
            });
        }

        for (var msg of messages) {
            console.log("X:")
            console.log(msg.msg);
        }

        const messages_store = JSON.stringify(messages);

        console.log(messages_store);

        const updateTexts = "update chat set patient_text='" + messages_store + "' where url='" + chat_id + "';";

        connection.query(updateTexts, (err) => {
            if (err) throw err;
        });
    });
}

module.exports = {
    getChatByID: getChatByID,
    isChatIDAvaliable, isChatIDAvaliable,
    createNewChat: createNewChat,
    getChatByPatient: getChatByPatient,
    saveChatMessage: saveChatMessage,
    getChatByDoc: getChatByDoc
}