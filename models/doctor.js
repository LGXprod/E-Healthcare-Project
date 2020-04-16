const getAllDoctors = (connection) => {
    return new Promise((resolve, reject) => {
        connection.query("select username from Doctor;", (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

const checkLoginCredentials = (connection, username, password) => {
    return new Promise((resolve, reject) => {
        var queryString = "select username from Doctor where username='" + username + "' and userPassword='" + password + "';";

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

const getAvailableAppointments = (connection, username) => {

}

module.exports = {
    checkLoginCredentials: checkLoginCredentials,
    getAllDoctors: getAllDoctors
}