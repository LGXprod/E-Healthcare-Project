$("#emergency_btn").click(() => {
    $.get("http://localhost:3000/Emergency", (url) => {
        window.location.replace(url);
    });
});