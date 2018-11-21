
 // Initialize Firebase
 
var config = {
	apiKey: "AIzaSyBT0zPNRhgJjPPr-nWqLoO_CVR4pmt-NJo",
	authDomain: "cmspeqas.firebaseapp.com",
	databaseURL: "https://cmspeqas.firebaseio.com",
	projectId: "cmspeqas",
	storageBucket: "cmspeqas.appspot.com",
	messagingSenderId: "96652663583"
	};
firebase.initializeApp(config);


firebase.auth().onAuthStateChanged(async function(user) {
   if (user) {
    
	document.getElementById("bod").style.display = '';
	
	//fillInitialInfo();
	var artist_label = document.getElementById('artists');
	var arwork_label = document.getElementById('artworks');
	var name_label = document.getElementById('title');
	
	
	var a = await fillInitialInfo(user.email);
	
	var artists = a[0];
	var artworks = a[1];
	var name = a[2];

	artist_label.innerHTML = artists;
	arwork_label.innerHTML = artworks;
	name_label.innerHTML = name;
	
	if(user.email == "finfantino@peqas.com"){
		document.getElementById("admin").style.display = '';
	}
	
	
	} else {
    window.location = "index.html";
}
});



//TODO later anhand der type den HTML Content zu bestimmen
async function fillInitialInfo(email_content){
	var ref = firebase.firestore().collection("users_ids");
	var user = await ref.where('email', '==', email_content).get().then((snapshot) => {
		var data = snapshot.docs[0].data();
		var name = data['name'];
		var initial_data = data['start_info'];
		var artist = initial_data['artists'];
		var arworks = initial_data['artworks'];
		return [artist,arworks, name];
	});
	return user;	
}


async function addClient(){
	//Get data from the fields 
	var u_name = document.getElementById("name").value;
	var u_email = document.getElementById("email").value;
	var u_type =document.getElementById("type").value;
	
	if(u_name == "" || u_email == "" || u_type == ""){
		alert("Du bist ein guter Tester ;)");
		return;
	}
	
	var ref = firebase.firestore().collection("users_ids");
	
	ref.doc(u_name).set({
		name: u_name,
		type: u_type,
		email: u_email,
		start_info: {
			artists : 0,
			artworks : 0
		}
	}).then(function() {
    console.log("Document successfully writtennn!");
	jQuery('#suc').modal('show'); 
			})
		.catch(function(error) {
    console.error("Error writing document: ", error);
	jQuery('#err').modal('show'); 
		});
	
}


function logOut(){
	firebase.auth().signOut().then(function() {
	window.location = "index.html";
}, function(error) {
	alert("An Error, ocurred");
	window.location = "index.html";
});
}
