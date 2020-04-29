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

// Close the userSelect window
document.querySelector(".closeSelect").addEventListener("click", function(){
    document.querySelector(".signup").style.display = "none";
});

// open patient sign up window
document.querySelector("#patientBtn").addEventListener("click", function(){
    document.querySelector(".signup").style.display = "none";
    document.querySelector(".signup-form-p").style.display = "flex";
});

// open doctor sign up window
document.querySelector("#doctorBtn").addEventListener("click", function(){
    document.querySelector(".signup").style.display = "none";
    document.querySelector(".signup-form-d").style.display = "flex";
});

// Close the patient signup window
document.querySelector(".close").addEventListener("click", function(){
    document.querySelector(".signup-form-p").style.display = "none";
    document.querySelector(".signup").style.display = "flex";
    //Clears inputs if the signup window is closed
    var inputs = document.getElementsByClassName("signup-input");
      for (var i=0 ; i < inputs.length ; i++){
            inputs[i].value = "";
          }
});

// Close the doctor signup window
document.querySelector(".closedoc").addEventListener("click", function(){
    document.querySelector(".signup-form-d").style.display = "none";
    document.querySelector(".signup").style.display = "flex";
    //Clears inputs if the signup window is closed
    var inputs = document.getElementsByClassName("signup-input");
      for (var i=0 ; i < inputs.length ; i++){
            inputs[i].value = "";
          }
});
