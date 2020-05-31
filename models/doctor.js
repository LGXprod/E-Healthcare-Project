const getAllDoctors = (connection, attributes) => {
    return new Promise((resolve, reject) => {
        connection.query("select " + attributes + " from Doctor;", (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

async function isProviderNoValid(connection, providerNo) {
    return new Promise((resolve, reject) => {
        connection.query("select providerNo from Valid_Provider_No where providerNo='" + providerNo + "';", (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length == 0) { // result.length is the number of doctors with that providerNo
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
}

async function insertNewDocDB(connection, body, username, password) {
    return new Promise((resolve, reject) => {
        const addNewDocQuery = "insert into Doctor (username, userPassword, fName, sName, certifications, providerNo) values "
        + "('" + username + "', '" + password + "', '" + body.fName + "', '" + body.sName + "', "
        +  body.certifications + ", " + body.providerNo + "');";

        console.log(addNewDocQuery);

        connection.query(addNewDocQuery, (err) => {
            if (err) { // if there is an error with the insert query
                reject(err);
            } else {
                resolve(true);
            }
            // if it doesn't meet the above condition it is assumed the insert query for the new doctor is successful
        });
    });
}

const getDoctorByUsername = (connection, username) => {
    return new Promise((resolve, reject) => {
        const queryString = "select * from doctor where username ='" + username + "';";

        connection.query(queryString, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
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
        connection.query("select certifications from Doctor where username = '" + username + "';", (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

const getOtherInfo = (connection, username) => {
    return new Promise((resolve, reject) => {
        connection.query("select specialisation, education, experience from doctor username='" + username + "';", (err, info) => {
            if (err) reject(err);
            resolve({
                specialisation: (JSON.parse(info[0].specialisation)),
                education: (JSON.parse(info[0].education)),
                experience: (JSON.parse(info[0].experience))
            });
        });
    });
}

const insertOtherInfo = (connection, username, specialisation, education, experience) => {
    return new Promise((resolve, reject) => {
        const queryString = "update doctor set specialisation='" + specialisation + "', education='" + education + "', experience='"
                            + experience + "' where username='" + username + "';";
                            // console.log(queryString)
        connection.query(queryString, (err) => {
            if (err) reject(err);
            resolve(true);
        })
    });
}

const insertNewCertifications = (connection, username) => {
    return new Promise((resolve, reject) => {
        connection.query("insert into Doctor (certifications) values '" + username + "' ;", (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
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
            // console.log(queryString);
            // is there appointment 8:15 no, {true, 8:15}, is there an appointment 8:30 yes {false, 8:30}

            connection.query(queryString, (err, appointments) => {
                if (err) reject (err);

                for (var appointment of appointments) {
            
                    const time = timeRangeToMinutes(availabiltity[0].startTime, appointment.appointmentTime);
                    // console.log(time);

                    availableAppointments[availableAppointments.findIndex(element => element.minutesAfterStart == time)].isAvailable = false;

                    // console.log(availableAppointments);
                }

                resolve({
                    startTime: availabiltity[0].startTime,
                    appointments: availableAppointments
                });
            });
        });
    });
}

const getFirstAvailableDoctor = (connection, username) => {
    
    return new Promise((resolve, reject) => {
        const queryString = "select doc_username from Doctor_Avaliability where doc_username  ='" + username + "';";

        connection.query(queryString, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });

}

const pushBackAppointments = (connection, doc_username, minutes) => {
    
    return new Promise((resolve, reject) => {
        const queryString = "update schedule set appointmentTime = date_add(appointmentTime, interval " + minutes + " minute) where doc_username = '" + doc_username + "';";
        console.log(queryString);

        connection.query(queryString, (err) => {
            if (err) reject(err);

            resolve();
        });
    });

}

const getRandomDoc = (connection) => {
    
    return new Promise((resolve, reject) => {
        connection.query("select username from doctor order by rand() limit 1;", (err, doc) => {
            if (err) reject(err);

            console.log(doc[0].username);
            resolve(doc[0].username);
        });
    });

}

module.exports = {
    checkLoginCredentials: checkLoginCredentials,
    getAllDoctors: getAllDoctors,
    getAvailableAppointments: getAvailableAppointments,
    getDoctorByUsername: getDoctorByUsername,
    insertNewCertifications: insertNewCertifications,
    getQualifications: getQualifications,
    getOtherInfo: getOtherInfo,
    insertOtherInfo: insertOtherInfo,
    isProviderNoValid: isProviderNoValid,
    insertNewDocDB: insertNewDocDB,
    getFirstAvailableDoctor: getFirstAvailableDoctor,
    pushBackAppointments: pushBackAppointments,
    getRandomDoc: getRandomDoc
}
