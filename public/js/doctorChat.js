$(function () {
    $("#sideMenu a").bind("click", function () {
        $("#sideMenu a").removeClass("clicked"); // Remove all highlights
        $(this).addClass("clicked"); // Add the class only for actually clicked element
    });
});

//Home highlighted when the PatientDashbaord page is loaded
$(document).ready(function () {
    $("#sideMenu a").slice( 1, 2, 3, 4, 5, 6).css({
        "background": "#397298", "border-left": "5px solid #aa74da",
        "padding": "15px 15px 15px 25px", "width": "280px", "transition": "0s"
    });
    $("#sideMenu a i").slice(0, 1, 2, 3, 4, 5, 6).css({ "color": "#aa74da" });
});
