const showLoginPage = (app, dir) => {
    app.get("/", (req, res) => {
        res.sendFile(dir + "/LoginPage.html");
    });
}

const checkLoginDetails = (app, connection) => {
    app.post("/", (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        var queryString = "select username from Patient where username='" + username + "' and userPassword='" + password + "';";

        connection.query(queryString, (err, result) => {
            if (err) {
                throw err;
            } else {
                if (result.length == 0) {
                    console.log("incorrect");
                } else {
                    console.log("correct");
                }
            }
        });
    });
}

module.exports = {
    showLoginPage: showLoginPage,
    checkLoginDetails: checkLoginDetails
}




//Get all elements in index.html with class=".input"
const inputs = document.querySelectorAll(".input");

//If clicked on it will focus
function addfocus(){
let parent = this.parentNode.parentNode;
parent.classList.add("focus");
}
//If clicked somewhere else it will focus somewhere else
function remfocus(){
let parent = this.parentNode.parentNode;
if(this.value == ""){
  parent.classList.remove("focus");
}
}

inputs.forEach(input => {
input.addEventListener("focus", addfocus);
input.addEventListener("blur", remfocus);
});

// Opens Signup when Sign up here is clicked
var links = document.getElementsByTagName('h1');
for( var i=0,il = links.length; i< il; i ++ ){
 links[i].onclick = function(){
   document.querySelector(".signup").style.display = "flex";
 }
}

// Close the signup window
document.querySelector(".close").addEventListener("click", function(){
    document.querySelector(".signup").style.display = "none";
});
