const faker = require("faker");

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
    const queryString = "insert into Doctor (username, userPassword, fName, sName) values ('"
                        + faker.internet.email() + "', '" + faker.internet.password() + "', '"
                        + faker.name.firstName() + "', '" + faker.name.lastName() + "');";
    console.log(queryString);

    connection.query(queryString, (err) => {
        if (err) throw err;
    });
}

module.exports = {
    addPatData: addPatData,
    addDocData: addDocData
}