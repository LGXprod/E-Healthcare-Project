$(function () {
    $("#sideMenu a").bind("click", function () {
        $("#sideMenu a").removeClass("clicked"); // Remove all highlights
        $(this).addClass("clicked"); // Add the class only for actually clicked element
    });
});

$(document).ready(() => {

    const urlParams = new URLSearchParams(window.location.search);
    const chat_id = urlParams.get('id');

    $.get("/PreviousMessages?id=" + chat_id, (data) => {
        const prev_chat = $.parseJSON(data);
        console.log(prev_chat);
        for (var msg of prev_chat) {
         $('#messages').append($('<li>').text(msg.msg));
        }
    });

});
