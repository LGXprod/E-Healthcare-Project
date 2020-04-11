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