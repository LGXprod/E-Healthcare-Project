//Book An Appointment highlighted when the Booking page is loaded
$(document).ready(function() {
    $("#sideMenu a").slice(2,3,4,5,6).css({"background": "#397298", "border-left": "5px solid #aa74da",
    "padding": "15px 15px 15px 25px", "width": "280px", "transition": "0s"});
    $("#sideMenu a i").slice(2,3,4,5,6).css({"color": "#aa74da"});

});
