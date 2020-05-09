$("#booking-btn").click(() => {
    var [year, month, day] = $("#date").val().split("-");
    month = parseInt(month);
    const date = year + "-" + (month < 10 ? "0" + month : month) + "-" + day;
    console.log(date)

    //shows paragraph and table when submit button is clicked
    document.querySelector(".table table").style.display = "table";
    document.querySelector(".booking-input p").style.display = "block";

    // when button is clicked it checks url for the json data sent from the server
    // look at the console to see the appointment data
    // note for now all appointments are available because we have made a way to book appointments yet
    // MUST RAN THE ADD RANDOM DOCTOR AND ADD RANDOM DOCTOR_AVALIABILITY FOR LOOP IN SERVER.JS
    // otherwise the json will be empty

        var selectedDate = date;
        var now = new Date();
        var nowString = now.getFullYear()  + "-" + (now.getMonth() < 10 ? "0" + now.getMonth() : now.getMonth()) + "-" + now.getDate();
        if (selectedDate < nowString) {
          alert("You entered a date that has already passed. \nPlease enter a valid date.") //if date is in the past this alert will show
          document.querySelector(".table table").style.display = "none";
          document.querySelector(".booking-input p").style.display = "none";
        } else {
          var refreshIntervalId = setInterval(appointmentInterval, 5000)

          function appointmentInterval(){
              $.ajax({url: "/appointmentsAvailable?date=" + date, success: function(result) {
                  console.log(result);;
              }});
          }

          $("#doctorTable table tbody").each(function() {
              if($(this).find('td').length == 0) {
                //delete row if no data
                $("tr").each(function() {
                    if (!$(this).text().trim()) {
                      this.remove();
                    }
                  });

                $.ajax({url: "/appointmentsAvailable?date=" + date, success: function(result) {
                  $.each(result, function(i, val) {
                    $("#doctorTable table tbody").append("<tr><td>"+ "Dr. " + val.fName + " " + val.sName +"</tr></td>");
                  });
                }});
              }
              else {
                $("#doctorTable table tbody").empty();

                $.ajax({url: "/appointmentsAvailable?date=" + date, success: function(result) {
                  $.each(result, function(i, val) {
                    $("#doctorTable table tbody").append("<tr><td>"+ "Dr. " + val.fName + " " + val.sName +"</tr></td>");
                  });
                }});

              }
          });
        }

        //Clicking on doctor name in the table will open a table specific to the clicked on doctor
        $(function book(){

            $('#doctorTable').on('click', 'td', function(){

              document.querySelector(".table table").style.display = "none";
              document.querySelector(".av-table table").style.display = "table";
              document.querySelector(".av-table #back-btn").style.display = "block";

              var doctorName = $(this).closest("tr").text()

              document.querySelector(".booking-input p").innerHTML = doctorName + " available appointments";

              //row index of doctor clicked (correlates to results array)
              var i = $(this).closest("tr").index();

              $(document).ready(function() {
                  // Fetch the initial table
                 refreshTable();
              });

              //needs to refresh table that is clicked on (this just refreshes the first initial clicked on table)
              function refreshTable(){
                  $.ajax({url: "/appointmentsAvailable?date=" + date, success: function(result) {
                        var doctorData = '';

                        // console.log(result[2].fName);
                        // console.log(result[2].schedule.appointments[3].isAvailable);

                  for(var a = 0; a < Object.keys(result[i].schedule.appointments).length; a++) {

                      $.each(result[i], function(index, val){

                          var startTime = result[i].schedule.startTime;
                          var minsAfter = result[i].schedule.appointments[a].minutesAfterStart;

                          //change start time of 10:00 to "10"
                          var splitHM = startTime.split(":");
                          var hour = parseInt(splitHM[0]);

                          var timeAfterStart = new Date();

                          timeAfterStart.setHours(hour);
                          timeAfterStart.setMinutes(minsAfter);

                          var appointmentTime = (timeAfterStart.getHours() + ":" + timeAfterStart.getMinutes());

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

                          doctorData += "<tr><td>" + formatTwelveHour(appointmentTime) + "</td>";

                          if(!result[i].schedule.appointments[a].isAvailable) {
                               doctorData += "<td>" + "NA" + "</td>";
                          }
                            return false;
                          });
                  }
                  $('#doctorAv table tbody').html(doctorData);


                  $('#doctorAv').on('click', 'tr', function timeOnClick(){
                      var appTime = $(this).closest("tr").text();
                      appTime = appTime.replace('Available','');
                      document.querySelector("#confirmApp").style.display = "inline-block";
                      document.querySelector("#confirmHeading").innerHTML = "Please confirm appointment with Doctor " + doctorName +
                                                                            " at " + appTime + " " + date;

                      //Turn 12-hour time into 24-time for mySQL use
                      var time = appTime;
                      var hours = Number(time.match(/^(\d+)/)[1]); // RegEx to seperate hours and minutes
                      var minutes = Number(time.match(/:(\d+)/)[1]);
                      var AMPM = time.match(/\s(.*)$/)[1];
                      if(AMPM == "PM" && hours<12) hours = hours+12;
                      if(AMPM == "AM" && hours==12) hours = hours-12;
                      var sHours = hours.toString();
                      var sMinutes = minutes.toString();
                      if(hours<10) sHours = "0" + sHours;  //to allow 00:00 format
                      if(minutes<10) sMinutes = "0" + sMinutes; //to allow 00:00 format
                      sqlTime = (sHours + ":" + sMinutes + ":" + "00");

                      document.getElementById("appDate").value = date + " " + sqlTime; //setting value to form inputs
                      document.getElementById("docUser").value = result[i].username; //setting value to form inputs

                  });

                  // delete row if unavailable (only want to display available appointments)
                  $(function(){
                      $("#doctorAv tr").each(function(){
                        var col_val = $(this).find("td:eq(1)").text();
                        if (col_val == "NA"){
                          $(this).text('')
                           }
                      });
                    });

                  }});
                }


              });



            });
});

//Book An Appointment highlighted when the Booking page is loaded
$(document).ready(function() {
    $("#sideMenu a").slice(1,2,3,4,5,6).css({"background": "#397298", "border-left": "5px solid #aa74da",
    "padding": "15px 15px 15px 25px", "width": "280px", "transition": "0s"});
    $("#sideMenu a i").slice(1,2,3,4,5,6).css({"color": "#aa74da"});

});

//Back button functionality
$(".av-table #back-btn").click(function(){
  document.querySelector(".table table").style.display = "table";
  document.querySelector(".av-table table").style.display = "none";
  document.querySelector(".av-table #back-btn").style.display = "none";
  document.querySelector(".booking-input p").innerHTML = "Please select a Doctor to see availability";
  document.querySelector("#confirmApp").style.display = "none";
});
