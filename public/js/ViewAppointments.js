//once the button is clicked for that specific date
$("#appointments-btn").click(() => {
    var [year, month, day] = $("#date").val().split("-");
    month = parseInt(month);
    const date = year + "-" + (month < 10 ? "0" + month : month) + "-" + day;
    console.log(date)


// gets the json array, and loops through it and prints out the result/values
var refreshIntervalId = setInterval(appointmentInterval, 5000) //refreshes the array every 6 secs from the server. 

          function appointmentInterval(){
              $.ajax({url: "/appointmentsAvailable?date=" + date, success: function(result) {
      $.each(result, function(i, val) {
        console.log(result);
      });
 }});
}



// $.ajax({url: "/appointmentsAvailable?date=" + date, success: function(result) {
//       $.each(result, function(i, val) {
//         // if(result.username == document.getElementById("#docName").value)
//            console.log(result);
//       });
//     }});

// function myFunction() {
//   document.getElementById("docName").innerHTML = .findIndex(/appointmentsAvailable);
// }


// get the initial table.
 $(document).ready(function() {
                  // Fetch the initial table
                 refreshTable();
              });


function refreshTable(){
                  $.ajax({url: "/appointmentsAvailable?date=" + date, success: function(result) {
                        var doctorData = ''; 

                  //looping thorough the appointments array inside the JSON array.
                  for(var a = 0; a < Object.keys(result[0].schedule.appointments).length; a++) {

                      //changes the minutes after to real life time i.e. 10:15am
                      $.each(result[0], function(index, val){

                          var startTime = result[0].schedule.startTime;
                          var minsAfter = result[0].schedule.appointments[a].minutesAfterStart;

                          //change start time of 10:00 to "10"
                          var splitHM = startTime.split(":");
                          var hour = parseInt(splitHM[0]);

                          var timeAfterStart = new Date();

                          timeAfterStart.setHours(hour);
                          timeAfterStart.setMinutes(minsAfter);

                          var appointmentTime = (timeAfterStart.getHours() + ":" + timeAfterStart.getMinutes());

                          //function changes to am/pm instead of 24 hour time.
                          function formatTwelveHour(date) {
                              var hours = timeAfterStart.getHours();
                              var minutes = timeAfterStart.getMinutes();
                              var ampm = hours >= 12 ? 'PM' : 'AM'; // assigns pm if over 12 and am if under 12
                              hours = hours % 12;
                              hours = hours ? hours : 12; // sets hour 0 to 12
                              minutes = minutes < 10 ? '0'+ minutes : minutes;
                              var strTime = hours + ':' + minutes + ' ' + ampm;
                              return strTime;
                          }

                          //puts values in the doctor data variable/table initialized at the top.
                          doctorData += "<tr><td>" + formatTwelveHour(appointmentTime) + "</td>"; 

                          //loops through the appointments to check which ones are available and adds a new coloumn for results.
                          if(!result[0].schedule.appointments[a].isAvailable) {
                               doctorData += "<td>" + "Unavailable" + "</td>";
                              }
                              
                            return false;
                          });
                  }
                  
                  // add the results to the html/ejs table
                  $('#doctorapp table tbody').html(doctorData);
    }
});
}
});
                  