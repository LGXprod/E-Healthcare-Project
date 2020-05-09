const faker = require("faker");
const doctor = require("../models/doctor");

const addPatData = (connection) => {
    var day = Math.floor(1 + Math.random()*30);
    var month = Math.floor(1 + Math.random()*11);

    if (day < 10) {
        day = "0" + day;
    }

    if (month < 10) {
        month = "0" + month;
    }
    
    const randDate = Math.floor(1920 + Math.random()*100) + "/" + month + "/" + day;

    const queryString = "insert into Patient (username, userPassword, fName, sName, medicareNo, medicareIRN, medicareExpiry) values "
                        + "('" + faker.internet.email() + "', '" + faker.internet.password() + "', '" + faker.name.firstName() + "', '"
                        + faker.name.lastName() + "', " + (Math.floor(1000000 + Math.random()*1000000)) + ", " 
                        + (Math.floor(1 + Math.random()*4)) + ", '" + randDate + "');";

    // console.log(queryString);

    connection.query(queryString, (err) => {
        if (err) {
            throw err;
        } else {
            console.log("Random patient data added");
        }
    });
}

const addDocData = (connection) => {
    const queryString = "insert into Doctor (username, userPassword, fName, sName, certifications) values ('"
                        + faker.internet.email() + "', '" + faker.internet.password() + "', '"
                        + faker.name.firstName() + "', '" + faker.name.lastName() + "', '" + faker.lorem.paragraphs() + "');";
    console.log(queryString);

    connection.query(queryString, (err) => {
        if (err) throw err;
    });
}

// this function is from: https://gist.github.com/miguelmota/7905510
var getDates = function(startDate, endDate) {
    var dates = [],
        currentDate = startDate,
        addDays = function(days) {
          var date = new Date(this.valueOf());
          date.setDate(date.getDate() + days);
          return date;
        };
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
};

const addAvailabilityData = (connection) => {
    var current = new Date();
    var dates = getDates(new Date(current.getFullYear(), current.getMonth(), current.getDate()),
                new Date(current.getFullYear()+1, current.getMonth(), current.getDate()));  

    doctor.getAllDoctors(connection, "username").then((doctors) => {
        for (var i = 0; i < doctors.length; i++) {
            for (let date of dates) {
                const theDate = date.getFullYear() + "-" + (date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()) + "-"
                                 + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());

                var queryString = "insert into Doctor_Availability (doc_username, startTime, endTime) values ('"
                                   + doctors[i].username + "', '" + theDate + " 10:00:00', '" + theDate + " 17:00:00');";

                connection.query(queryString, (err) => {

                });
            }
        }   

        console.log("Added availability data");
    }).catch((err) => {
        console.log(err);
    });
}

const addOtherDoctorInfo = (connection) => {

    const specialisations = ["General Practitioner", "Cardiologist", "Pediatrician", "Dermatologist"];
    const university = ["University of NSW", "University of Sydney", "University of Western Sydney", "University of Cambridge"];
    
    doctor.getAllDoctors(connection, "username").then((doctors) => {
        for (var theDoctor of doctors) {
            doctor.insertOtherInfo(connection, theDoctor.username, specialisations[Math.floor(Math.random()*Math.floor(4))]
                , university[Math.floor(Math.random()*Math.floor(4))], faker.lorem.sentence()).then((success) => {
                    
                }).catch((err) => {
                    console.log(err);
                });
        }
    }).catch((err) => {
        console.log(err);
    });

}

const addProviderNo = (connection) => {
    const queryString = "insert into Valid_Provider_No (providerNo) values ('"
                        + (Math.floor(1000000 + Math.random()*1000000)) + "');";
    
    connection.query(queryString, (err) => {
        if (err) throw err;
    });
}

module.exports = {
    addPatData: addPatData,
    addDocData: addDocData,
    addAvailabilityData: addAvailabilityData,
    addOtherDoctorInfo: addOtherDoctorInfo,
    addProviderNo: addProviderNo
}