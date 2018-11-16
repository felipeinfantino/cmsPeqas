var user = firebase.auth().currentUser;

var name = "";
var type = "";
var id = "";

if (user) {
	alert("Logg");
} else {
	alert("Not Loggd");
	window.location = "404.html";
}


