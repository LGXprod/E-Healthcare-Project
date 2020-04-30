# E-Healthcare-Project

## Recently added NPM packages

- express-session
- express-mysql-session

## Data the front end GETS using AJAX

### Appointments/Bookings

The booking data of all doctors is sent as a JSON object to the /appointmentsAvailable?date=(some date in form yyyy-mm-dd) endpoint. 

Example: I want to get the available appointments for doctor x (their first name: A, and last name: B) on the 20th of May 2020.

First you need to make an ajax call using jquery in the front end js (NOT THE BACK END (MAKE A SOMETHING.JS INSIDE PUBLIC/JS/) to retrieve the JSON data. The below code is how you do this:

$.ajax({url: "/appointmentsAvailable?date=" + date, success: function(result) {
     // your code that uses the result JSON
}});

The result parameter contains the JSON data.

The JSON data has the following structure:

The result parameter (an array of objects, each object has these attributes):
  -fName
  -sName
  -schedule (an object that has the following attributes):
      -startTime
      -appointments (an array of objects, each object has these attributes):
          -minutesAfterStart
          -isAvailable
          
Therefore, to get doctor x's (their first name: A, and last name: B) appointments you need to loop through the result until you find a doctor that has fName=A and sName=B. Then you need to get that element and access the startTime and minutes after variables using the above structure. One method of doing this is as follows:

$.ajax({url: "/appointmentsAvailable?date=" + date, success: function(result) {

     for (var doctor of result) { // loop throw each element in result and save each element in the doctor variable
          if (doctor.fName=="A" && doctor.sName=="B") { // how to determine if it's doctor x
                console.log("Doctor x starts at: " + startTime);
                console.log("Doctor x available appointments (using time after start):");
                for (var appointment of doctor.schedule.appointments) {
                    if (isAvailable) { // If you only want appointments that are still available to book
                        console.log(appointment.minutesAfterStart);
                    }
                }
          }
      } 
}});
          
You'll have to use some simple time maths to convert a startTime and minutesAfterStart variable into a timeOfAppointment variable. But above is how you would find startTime and minutesAfterStart and print it.

## Data the front end GETS using EJS

The majority of pages that use the .ejs extension get their data through a JS object (variable_name.attribute) inside the ejs file itself. Check https://www.npmjs.com/package/ejs to see how to use EJS on the front end or google EJS something. The two basics are:
     
     -Assigning a HTML tag/attribute a value: <%= variable_name %>
     -Control flow (e.g. loops and functions). For example: 
     
     <% for (*for loop conditions*) { %>
          <*logic inside the loop*>
     <% } %>
                                                            
### How do you find the name of the variable you should be using in the EJS file? 
Ask a member of the back end group and they will tell you. In the future we will have the names of these variables in this section of the document. 
                                               
