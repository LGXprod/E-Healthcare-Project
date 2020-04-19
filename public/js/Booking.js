$("#booking-btn").click(() => {
    var [year, month, day] = $("#date").val().split("-");
    month = parseInt(month) - 1;
    const date = year + "-" + (month < 10 ? "0" + month : month) + "-" + day;
    console.log(date)

    // when button is clicked it checks url for the json data sent from the server
    // look at the console to see the appointment data
    // note for now all appointments are available because we have made a way to book appointments yet
    // MUST RAN THE ADD RANDOM DOCTOR AND ADD RANDOM DOCTOR_AVALIABILITY FOR LOOP IN SERVER.JS
    // otherwise the json will be empty
    setInterval(() => {
        $.ajax({url: "/appointmentsAvailable?date=" + date, success: function(result) {
            console.log(result);
        }});
    }, 5000);
});