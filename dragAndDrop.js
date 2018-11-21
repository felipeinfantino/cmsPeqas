var config = {
	apiKey: "AIzaSyBT0zPNRhgJjPPr-nWqLoO_CVR4pmt-NJo",
	authDomain: "cmspeqas.firebaseapp.com",
	databaseURL: "https://cmspeqas.firebaseio.com",
	projectId: "cmspeqas",
	storageBucket: "cmspeqas.appspot.com",
	messagingSenderId: "96652663583"
	};
	
firebase.initializeApp(config);

const db = firebase.firestore();

let current_user_email = null;

//TODO type dynamic
firebase.auth().onAuthStateChanged(async function(user) {
   if (user) {
	   
	   document.getElementById("bod").style.display = '';
	    var info = await fillInitialInfo(user.email);
	   
	  document.getElementById("title").innerHTML = info[2];
	   
		console.log("User is logged innn : " +user.email);
		current_user_email = user.email;
	}else{
		window.location = "index.html";
	}
});


//Define Drop Areas

//CSV Drop
let dropAreaCSV = document.getElementById('drop-area-csv')

//Image drop
let dropAreaImg = document.getElementById('drop-area-img')

// General functions
function highlight(e) {
  dropAreaCSV.classList.add('highlight');
  dropAreaImg.classList.add('highlight');
}
function unhighlight(e) {
  dropAreaCSV.classList.remove('highlight');
  dropAreaImg.classList.remove('highlight');
}
 function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

//Add general functions to both areas
['dragenter', 'dragover'].forEach(eventName => {
  dropAreaCSV.addEventListener(eventName, highlight, false);
  dropAreaImg.addEventListener(eventName, highlight, false);
  
});

['dragleave', 'drop'].forEach(eventName => {
  dropAreaCSV.addEventListener(eventName, unhighlight, false);
  dropAreaImg.addEventListener(eventName, unhighlight, false);
});


dropAreaCSV.addEventListener('dragenter', preventDefaults, false);
dropAreaCSV.addEventListener('dragleave', preventDefaults, false);
dropAreaCSV.addEventListener('dragover', preventDefaults, false);
dropAreaCSV.addEventListener('drop', preventDefaults, false);
dropAreaCSV.addEventListener('drop', handleCSVDrop, false)


dropAreaImg.addEventListener('dragenter', preventDefaults, false);
dropAreaImg.addEventListener('dragleave', preventDefaults, false);
dropAreaImg.addEventListener('dragover', preventDefaults, false);
dropAreaImg.addEventListener('drop', preventDefaults, false);
dropAreaImg.addEventListener('drop', handleImgDrop, false)
  


function handleCSVDrop(e){
  
  let dt = e.dataTransfer
  let files = dt.files
  if(files.length > 1){
	alert("Please only one CSV file");
	return;
  }
  parseCSV(files[0])
  
}

function handleCSVDropFromHtml(files){
if(files.length > 1){
	alert("Please only one CSV file");
	return;
  }
  parseCSV(files[0])
	
}

function parseCSV(file){
	Papa.parse(file, {
				header: true,
				dynamicTyping: true,
				complete: function(results) {
				uploadResultsToFirebase(results);
			}
	});
}

//TODO upload to firebase
function uploadResultsToFirebase(results){
	
	console.log(results);
	var data = results["data"];
	//var succ = true;
	for(var i = 0; i < data.length; i++){
		console.log("iteration , length" +data.length );
		//Hier Galerie soll dynamisch sein und auch kunstwerk
		
		var s = data[i]["ID"].replace(/\s+/, ""); //White spaces
		var k = data[i]["Title"].replace(/\s+/, "");
		
		s = s.replace(/\//g, ''); // Foward slashes
		s = s.replace(/\\/g, ''); // Backslashes
		
		k = k.replace(/\//g, ''); // Foward slashes
		k = k.replace(/\\/g, ''); // Backslashes
		
	
		var str = s+ "_" +k;
		
		data[i]["galerie_id"] = current_user_email
		
		console.log("acaaa")
		console.log(data[i]["galerie_id"])
		console.log(data[i])
		
		//succ setzen 
		db.collection("user").doc("galerie").collection("kunstwerk").doc(str).set(data[i])
			.then(function() {
				console.log("Document successfully writtennnn!");
			})
			.catch(function(error) {
				console.error("Error writing document: ", error);
			});

	}
	/*
	if(succ){
		jQuery('#suc-csv').modal('show'); 
	}else{
		jQuery('#err-csv').modal('show'); 
	}
	*/
	
	document.getElementById('fileElem').value = '';
	
}






function handleImgDrop(e) {

  let dt = e.dataTransfer
  let files = dt.files
  
  for(var i = 0; i < files.length; i++){
	  //alert(files[i].name)
	  uploadImg(files[i]);
  }
  
}

function uploadImg(file){

// Create a root reference
var storageRef = firebase.storage().ref();

var uploadImgRef = storageRef.child('Galerien/berlinischegalerie_id/uploadedImgs/'+ file.name);

uploadImgRef.put(file).then(function(snapshot) {
  alert('Uploaded a blob or file!' + file.name);
}).catch(function(error) {
				console.error("Error writing document: ", error);
			});
	
}

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


  
  
  
function logOut(){
	firebase.auth().signOut().then(function() {
	window.location = "index.html";
}, function(error) {
	alert("An Error, ocurred");
	window.location = "index.html";
});
}
  
  /*
  FOR PARSING RESULTS MAYBE 
  
		var keys = Object.keys(data[i]);
		var s = "";
		keys.forEach(function(x){
			s = s + x + " : " + data[i][x] + " \n";
		});
		alert(s);
		
		
		var artist = data[i]["Artist"];
		var id = data[i]["ID"];
		var description = data[i]["Artist Description"];
		var country = data[i]["Country"];
		var technique = data[i]["Technique"];
		var title = data[i]["Title"];
		var titleDes = data[i]["Title Description"];
		var width = data[i]["Width (cm)"];
		var height = data[i]["Hight (cm)"];
		var year = data[i]["Year"];
		var price = data[i]["Price (EUR)"];
		
		var ganzesString = "ID : " + id + "\nArtist : " + artist + "\nArtist Description : " + description + "\nCountry : " + country 
						+ "\nTechnique : " + technique +  "\nTitle : " + title + "\nTitle Description : " + titleDes + "\nWidth : " + width 
						+ "\nHeight : " + height + "\nYear : " + year + "\nPrice" + price;
						
		alert(ganzesString)
		*/
  
  



