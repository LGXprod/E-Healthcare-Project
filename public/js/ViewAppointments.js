$("#appointment-btn").click(() => {
    var [year, month, day] = $("#date").val().split("-");
    month = parseInt(month);
    const date = year + "-" + (month < 10 ? "0" + month : month) + "-" + day;
    console.log(date)

    var refreshIntervalId = setInterval(appointmentInterval, 10000);

    function appointmentInterval(){
        $.ajax({url: "/appointmentsAvailable?date=" + date, success: function(result) {
            console.log(result);
        }});
    }

    document.querySelector("#text-area h2").style.display = "none"

    $(document).ready(function() {
        // Fetch the initial table
       refreshTable();
    });

    //needs to refresh table that is clicked on (this just refreshes the first initial clicked on table)
    function refreshTable(){
        $.ajax({url: "/appointmentsAvailable?date=" + date, success: function(result) {
              var doctorData = '';

              var docUsername = document.getElementById("docName").innerHTML;
              //find the index that matches the logged in doctors username to the JSON array
              var index = result.findIndex(function(item, i){
                return item.username === docUsername;
              });

        for(var a = 0; a < Object.keys(result[index].schedule.appointments).length; a++) {

            $.each(result[index], function(item, val){

                var startTime = result[index].schedule.startTime;
                var minsAfter = result[index].schedule.appointments[a].minutesAfterStart;


                //change start time of 10:00 to "10"
                var splitHM = startTime.split(":");
                var hour = parseInt(splitHM[0]);

                var timeAfterStart = new Date();

                timeAfterStart.setHours(hour);
                timeAfterStart.setMinutes(minsAfter);

                var appointmentTime = (timeAfterStart.getHours() + ":" + timeAfterStart.getMinutes());
                //change the time to 12 hour with AM and PM
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
                // add the time to column 1
                doctorData += "<tr><td>" + formatTwelveHour(appointmentTime) + "</td>";
                // add available or unavailable to column 2
                if(result[index].schedule.appointments[a].isAvailable) {
                     doctorData += "<td>" + "Available" + "</td>";
                }
                else{
                     doctorData += "<td>" + "" + "</td>";
                }
                  return false;
                });
        }
        $('#doctor-app table tbody').html(doctorData); //apend this all to doctor-app table

        // delete row if available (we only want to show unavailable appointments)
        $(function(){
            $("#doctor-app tr").each(function(){
              var col_val = $(this).find("td:eq(1)").text();
              if (col_val == "Available"){
                $(this).text('')
                 }
            });
          });

          //if table is empty replace table with text else display table
            $('#doctor-app table tbody').each(function() {
                if($(this).find('td').length == 0) {
                 document.querySelector(".av-table table").style.display = "none";
                 document.querySelector("#text-area h2").style.display = "block";
                }
                else {
                 document.querySelector(".av-table table").style.display = "table";
                }
              });

              $('#doctor-app table tbody').on('click', 'tr', function timeOnClick(){
                  var appTime = $(this).closest("tr").text();
                  appTime = appTime.replace('Available','');
                  document.querySelector("#confirmApp").style.display = "inline-block";
                  document.querySelector("#confirmHeading").innerHTML = "Please click here to enter chat with patient " + "";
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

                  document.getElementById("appTime").value = sqlTime; //setting value to form inputs

        
                    $('.chat-btn').click(function() {
                           window.location.href = "/StartChart?date=" + date + "&" + "time=" + sqlTime;
                      });

                });
}});

}
});


$(function () {
    $("#sideMenu a").bind("click", function () {
        $("#sideMenu a").removeClass("clicked"); // Remove all highlights
        $(this).addClass("clicked"); // Add the class only for actually clicked element
    });
});

//Home highlighted when the PatientDashbaord page is loaded
$(document).ready(function () {
    $("#sideMenu a").slice(1, 2, 3, 4, 5, 6).css({
        "background": "#397298", "border-left": "5px solid #aa74da",
        "padding": "15px 15px 15px 25px", "width": "280px", "transition": "0s"
    });
    $("#sideMenu a i").slice(1, 2, 3, 4, 5, 6).css({ "color": "#aa74da" });
});
