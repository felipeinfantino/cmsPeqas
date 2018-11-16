var user = firebase.auth().currentUser;

	if (user) {
		alert("Logg");
	} else {
	alert("Not Loggd");
	window.location = "404.html";
	}




var bg = document.getElementById('btn')

function submitOn() {
	
	window.alert('asda')
	
	var artist =document.getElementById("artist").innerText;
	window.alert(artist);
	
	firebase.firestore().collection("users").doc("galerien").collection("berlinischeGalerie").get().then((snapshot) => {
		
		snapshot.docs.forEach(doc => {
				console.log(doc.data())
			})
		
		})
	
	
}


function hide_image() {
	
	window.alert("sfd")
    var x = document.getElementById("logo");
    if (x.style.visibility === "visible") {
        x.style.visibility = "hidden";
    } else {
        x.style.visibility = "hidden";
    }
}

function submitOn1() {
	
	console.log("dad");
	var artist =document.getElementById("artist").innerText;
	window.alert(artist);
	
	var citiesRef = firebase.firestore().collection("users").doc("galerien").collection("berlinischeGalerie").doc("artists").collection(artist).doc("kunstwerke").set({
   Empty: "Empty"
})
.then(function() {
    console.log("Document successfully written!" );
})
.catch(function(error) {
    console.error("Error writing document: ", error);
});

	//window.alert('succ1')
	/*
	
	
	
	
	
	citiesRef.collection(mainTes).add({
    name: "Tokyo",
    country: "Japan"
});


collection("berlinischeGalerie").doc("bla");

*/

	//window.alert('succ')
	//window.alert(citiesRef)
	
}

/*


	var citiesRef = firebase.firestore().collection("users").doc("galerien").collection("berlinischeGalerie").doc("artists").collection(artist).doc("kunstwerke").set({
   Empty: "Empty"
})
.then(function() {
    console.log("Document successfully written!");
})
.catch(function(error) {
    console.error("Error writing document: ", error);
});


*/