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
	jQuery('#justOneFile').modal('show'); 
	return;
  }
  parseCSV(files[0])
  
}

function handleCSVDropFromHtml(files){
if(files.length > 1){
	jQuery('#justOneFile').modal('show');
	return;
  }
  parseCSV(files[0])
	
}

function parseCSV(file){
	jQuery('#contentUpload').modal('show'); 
	Papa.parse(file, {
				header: true,
				dynamicTyping: true,
				complete: function(results) {
				uploadResultsToFirebase(results);
			}
	});
}

//TODO upload to firebase
async function uploadResultsToFirebase(results){
	console.log(results);
	var data = results["data"];
	var failedFiles = [];
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
		var succ = await db.collection("user").doc("galerie").collection("kunstwerk").doc(str).set(data[i])
			.then(function() {
				console.log("Document successfully writtennnn!");
				return true;
			})
			.catch(function(error) {
				console.error("Error writing document: ", error);
				return false;
			});
			
		if(!succ){
			failedFiles.push(data[i]["Title"]); 
		}
	}
	
	jQuery('#contentUpload').modal('hide'); 
	if(failedFiles.length == 0){
		jQuery('#suc-csv').modal('show'); 
	}else{
		var allFilesAsString = "Error in Images : \n";
		for(var i = 0; i < failedFiles.length; i++){
			allFilesAsString = allFilesAsString + failedFiles[i] + "\n";
		}
		document.getElementById("errorFiles").innerHTML = allFilesAsString;
		jQuery('#err-csv').modal('show');
	}
	document.getElementById('fileElem').value = '';
	
}


async function handleFiles(files){
	jQuery('#contentUpload').modal('show'); 
	var failedImages = []
	for(var i = 0; i < files.length; i++){
	  var succ = await uploadImg(files[i]);
	  if(!succ){
		  failedImages.push(files[i].name)
	  }
	}
	jQuery('#contentUpload').modal('hide');
	if(failedImages.length == 0){
		jQuery('#suc-img').modal('show'); 
	}else{
		var allFilesAsString = "Error in Images : \n";
		for(var i = 0; i < failedImages.length; i++){
			allFilesAsString = allFilesAsString + failedImages[i] + "\n";
		}
		document.getElementById("errorImages").innerHTML = allFilesAsString;
		jQuery('#err-img').modal('show');
	}
}



function handleImgDrop(e) {

  let dt = e.dataTransfer
  let files = dt.files
  handleFiles(files);
  
}

async function uploadImg(file){

// Create a root reference
var storageRef = firebase.storage().ref();

var uploadImgRef = storageRef.child('Galerien/berlinischegalerie_id/uploadedImgs/'+ file.name);

var result = uploadImgRef.put(file).then(function(snapshot) {
	return true;
}).catch(function(error) {
				console.error("Error writing document: ", error);
				return false;
			});

return result;
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
  
  



