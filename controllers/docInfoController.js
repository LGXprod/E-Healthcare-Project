const doctor = require("../models/doctor");

const showDocInfoPage = (app, connection) => {
    const doc_username = req.session.username;

    // get the certifications of the doctor with the above username
    // and then render that info into ejs file
    // below will have to be inside a promise to get the certifications

    app.get("/DoctorInfo", (req, res) => {
        res.render("DoctorInfo", {
            doctorInfo: // variable that contains the doctor's certifications
        })
    });
}

const updateDocInfo = (app, connection) => {
    app.post("/updateDocInfo", (req, res) => {
        const doc_username = req.session.username;
        const newInfo = req.body.description;

        // make a function inside the doctor model and have it replace the current info with the new info
        // I have declared this function it's called insertNewCertifications()
        // If the promise returns true then execute the below code

        res.redirect("/DoctorInfo");
    });
}