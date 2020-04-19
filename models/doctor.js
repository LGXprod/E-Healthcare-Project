const getAllDoctors = (connection, attributes) => {
    return new Promise((resolve, reject) => {
        connection.query("select " + attributes + " from Doctor;", (err, result) => {
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

function timeRangeToMinutes(startTime, endTime) {
    return parseInt(endTime.split(":")[0])*60 + parseInt(endTime.split(":")[1])
    - parseInt(startTime.split(":")[0])*60 + parseInt(startTime.split(":")[1]);
}

const getAvailableAppointments = (connection, username, date) => {
    return new Promise((resolve, reject) => {
        const queryString = "select date_format(startTime, '%H:%i') as startTime, date_format(endTime, '%H:%i') as endTime from Doctor_Availability where startTime like '" 
                            + date + "%' and doc_username='" + username + "';";

        connection.query(queryString, async (err, availabiltity) => {
            if (err) reject(err);

            // it is key that a patient can only book in 15 increments of time (e.g. 12:00, 12:15, 12:30 ...)
            // and that doctors can have to finish at a time that is divisible by 15 

            const time = timeRangeToMinutes(availabiltity[0].startTime, availabiltity[0].endTime);
            var availableAppointments = [];

            for (var i = 0; i <= time; i = i + 15) {
                availableAppointments.push({
                    minutesAfterStart: i,
                    isAvailable: true
                });
            }

            const queryString = "select date_format(appointmentTime, '%H:%i') as appointmentTime from Schedule where appointmentTime like '" + date + "%' and doc_username='" + 
                                username + "';";

            // is there appointment 8:15 no, {true, 8:15}, is there an appointment 8:30 yes {false, 8:30}

            connection.query(queryString, (err, appointments) => {
                if (err) reject (err);

                for (var appointment of appointments) {
                    const time = timeRangeToMinutes(availabiltity[0].startTime, appointment.appointmentTime);

                    availableAppointments[availableAppointments.findIndex(element => element.minutesAfterStart == time)].isAvailable = false;
                }

                resolve({
                    startTime: availabiltity[0].startTime,
                    appointments: availableAppointments
                });
            });
        });
    });
}

module.exports = {
    checkLoginCredentials: checkLoginCredentials,
    getAllDoctors: getAllDoctors, 
    getAvailableAppointments: getAvailableAppointments
}