$(document).ready(() => {

    console.log("yo");
    setInterval(() => {
        $.get("http://localhost:3000/IsEmergency", (data) => {
            console.log(data.isEmergency);
            if (data.isEmergency) {
                alert("Patient " + data.name + " is having an emergency. Please check chat.");
            } 
        });
    }, 1000);

});