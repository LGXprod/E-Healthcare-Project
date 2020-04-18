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

const getQualifications = (connection, username) => {
    return new Promise((resolve, reject) => {
        
    });
}

const getAvailableAppointments = (connection, username) => {
    return new Promise((resolve, reject) => {
        const queryString = "select date_format(startTime, '%H:%i') as theStartTime, date_format(endTime, '%H:%i') as theEndTime from Doctor_Availability where startTime like '" 
                            + date + "%' and doc_username='" + username + "';";
        console.log(queryString)

        connection.query(queryString, (err, availabiltity) => {
            if (err) reject(err);

            console.log(availabiltity);

            // const queryString = "select appointmentTime from Schedule where appointmentTime like '" + date + "%' and doc_username='" + 
            //                     username + "';";

            // is there appointment 8:15 no, {true, 8:15}, is there an appointment 8:30 yes {false, 8:30}

            // connection.query(queryString, (err, appointments) => {
                
            // });
        });
    });
}

module.exports = {
    checkLoginCredentials: checkLoginCredentials,
    getAllDoctors: getAllDoctors, 
    getAvailableAppointments: getAvailableAppointments
}