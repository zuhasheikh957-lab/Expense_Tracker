// Login functionality
document.querySelector("form").addEventListener("submit", function(e){
  e.preventDefault(); // page reload rok do

  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  let storedEmail = localStorage.getItem("email");
  let storedPassword = localStorage.getItem("password");

  if(email === storedEmail && password === storedPassword){
    alert("Login Successful!");
    // Successful login par dashboard.html pe redirect
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid Email or Password");
  }
});
