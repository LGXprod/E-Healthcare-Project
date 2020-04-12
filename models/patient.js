async function isUsernameAvailable(connection, username) {
    return new Promise((resolve, reject) => {
        connection.query("select username from Patient where username='" + username + "';", (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length == 0) { // result.length is the number of patient's with that username
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
}

async function insertNewPatDB(connection, body, username, password) {
    return new Promise((resolve, reject) => {
        const addNewPatQuery = "insert into Patient (username, userPassword, fName, sName, medicareNo, medicareIRN, medicareExpiry) values "
        + "('" + username + "', '" + password + "', '" + body.fName + "', '" + body.sName + "', "
        +  body.medicareNo + ", " + body.medicareIRN + ", '" + body.medicareExpiry + "');";

        console.log(addNewPatQuery);

        connection.query(addNewPatQuery, (err) => {
            if (err) { // if there is an error with the insert query
                reject(err);
            } else {
                resolve(true);
            }
            // if it doesn't meet the above condition it is assumed the insert query for the new patient is successful
        });
    });
}

const getPatByUsername = (connection, username) => {
    return new Promise((resolve, reject) => {
        connection.query("select * from Patient where username = '" + username + "';", (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length === 1) {
                    console.log(result[0]);
                    resolve(result[0]);
                } else {
                    resolve(null);
                }
            }
        });
    })
}

const checkLoginCredentials = (connection, username, password) => {
    return new Promise((resolve, reject) => {
        var queryString = "select username from Patient where username='" + username + "' and userPassword='" + password + "';";

        connection.query(queryString, (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length == 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }
        });
    });
}

module.exports = {
    checkLoginCredentials: checkLoginCredentials,
    isUsernameAvailable: async (connection, username) => { return await isUsernameAvailable(connection, username) },
    insertNewPatDB: async (connection, body, username, password) => { return await insertNewPatDB(connection, body, username, password) },
    getPatByUsername: getPatByUsername
}