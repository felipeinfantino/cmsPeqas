
var input = document.getElementById("email");

input.addEventListener("keyup", function(event) {
  event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Trigger the button element with a click
    document.getElementById("signIn").click();
  }
});


async function authenticate(){
		
var email_label = document.getElementById("email");
var email_feedback = document.getElementById("email_feedback");
var email_content = email_label.value;

var is_valid_user = await check_for_user(email_content);

if(!is_valid_user){
	console.log("User doesnt exist");
	email_label.classList.add("is-invalid");
	email_feedback.style.display = "inline";
	return;
}

console.log("user exists");
var provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().signInWithPopup(provider).then(async function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  console.log(token);
  var user = result.user;
  //await setTokenIfNotEmpty(token);
  var email_label = document.getElementById("email");
  var email_feedback = document.getElementById("email_feedback");
  var email_content = email_label.value;
  
  if(user.email != email_content){
	email_label.classList.add("is-invalid");
	email_feedback.style.display = "inline";
	firebase.auth().signOut().then(function() {
		console.log('User does not match with google auth , given email : ' + email_content + ' , google auth email ' + user.email + ' => signing out');
		var string = 'Given email : ' + email_content + '\n  Google auth email : ' + user.email + ' .Please sign out from the google account of your browser and try again';
		document.getElementById("google").innerHTML = string;
		jQuery('#user-not-match').modal('show'); 
	}, function(error) {
		console.error('Sign Out Error', error);
		});
  }else{
	await relocate();	 
  }
  
}).catch(function(error) {
	
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  console.log("Error while auth : " + errorMessage );
  console.log(email);
});

}

async function relocate(){
	window.location = "home.html";
}

async function check_for_user(email_content){
	var ref = firebase.firestore().collection("users_ids");
	var user = await ref.where('email', '==', email_content).get().then((snapshot) => {
		return snapshot.docs.length > 0; //Should be exactly one
	});
	return user;
}


/*
For now id is email

async setTokenIfNotEmpty(token){

	var ref = firebase.firestore().collection("users_ids");
	await ref.where('email', '==', email_content).get().then((snapshot) => {
		//There should be only one user 
		snapshot.docs[0].update({
				id: token
			});
			
		console.log("id succesful changed");
	});

}
*/



