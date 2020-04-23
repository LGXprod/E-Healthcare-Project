$("#booking-btn").click(() => {
    var [year, month, day] = $("#date").val().split("-");
    month = parseInt(month) - 1;
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

    var refreshIntervalId = setInterval(appointmentInterval, 5000)

    function appointmentInterval(){
        $.ajax({url: "/appointmentsAvailable?date=" + date, success: function(result) {
            console.log(result);;
        }});
    }

    $.ajax({url: "/appointmentsAvailable?date=" + date, success: function(result) {
      $.each(result, function(i, val) {
        $("#doctorTable table tbody").append("<tr><td>"+ val.fName + " " + val.sName +"</tr></td>");
      });
    }});

    //delete first row for doctor table as it was white space
    document.querySelector(".table table").deleteRow(0);

    //Clicking on doctor name in the table will open a table specific to the clicked on doctor
    $(function(){
        $('#doctorTable').on('click', 'td', function(){

          document.querySelector(".table table").style.display = "none";
          document.querySelector(".av-table table").style.display = "table";
          document.querySelector(".av-table #back-btn").style.display = "block";

          var doctorName = $(this).closest("tr").text()

          document.querySelector(".booking-input p").innerHTML = doctorName + " Appointments";

          //row index of doctor clicked (correlates to results array)
          var i = $(this).closest("tr").index();

          $(document).ready(function() {
              // Fetch the initial table
              refreshTable();
                // Fetch every 5 seconds
              setInterval(refreshTable, 5000);
          });

          //needs to refresh table that is clicked on (this jsut refreshes the first initial clicked on table)
          function refreshTable(){
                  $.ajax({url: "/appointmentsAvailable?date=" + date, success: function(result) {
                    var doctorData = '';

              for(var a = 0; a < 29; a++) {
                  $.each(result[i], function(index, val){
                    doctorData += "<tr><td>" + result[i].schedule.appointments[a].minutesAfterStart + "</td>";

                    if(result[i].schedule.appointments[a].isAvailable) {
                      doctorData += "<td>"+ "Available" +"</td>";
                    }
                    else {
                      doctorData += "<td>"+ "Unavailable" +"</td>";
                    }

                    });
              }
                          $('#doctorAv table tbody').html(doctorData);
                  }});
              }

          });

          });
});


//Book An Appointment highlighted when the PatientDashbaord page is loaded
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
});
