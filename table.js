

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
	  var info = await fillInitialInfo(user.email);
	   
	  document.getElementById("title").innerHTML = info[2];
	  
    
	var a = await getDataForTable(user.email);
	//var b = await getDataForTable2(user.email);
	//createTable(a);
	
	var convertedKeyToColums = [{ title: "No info, please upload csv" }];
	var convertedData = [["No info, please upload csv"]];
	
	
	if(a != null){
		 convertedKeyToColums = convertKeyToColums(a[0]);
		 convertedData = convertData(a);
	}
	
	
   const dataTable = jQuery('#dataTable').DataTable({
          data: convertedData,
          columns: convertedKeyToColums
        });
	
	
	} else {
    window.location = "index.html";
}
});


function convertData(data){
	var arrayFromArrays = [];
	//Because in data[0] are the keys
	for(var i = 1; i < data.length; i++){
		arrayFromArrays.push(data[i])
	}
	return arrayFromArrays;
}

function convertKeyToColums(data){
	
	var dict = [];
	for(var i = 0; i < data.length; i++){
		dict.push({ title: data[i] })
	}
	return dict;
	
}

//TODO id not email return data [0] keys [1] row 1 [2] row 2 and so on
async function getDataForTable(email_content){
	var ref = firebase.firestore().collection("users_ids");
	var user = await ref.where('email', '==', email_content).get().then((snapshot) => {
		var data = snapshot.docs[0].data();
		var name = data['name'];
		var type = data['type'];
		return [name,type];
	});
	
	var ref2 = firebase.firestore().collection("user").doc(user[1]).collection('kunstwerk');
	
	var data = await ref2.where('galerie_id', '==', email_content).get().then((snapshot) => {
		
		var array_data = []
		console.log(snapshot)
		console.log("Email")
		console.log(email_content)
		if(snapshot.docs.length <= 0){
			return null;
		}
		
		var data = snapshot.docs[0].data();
		delete data["galerie_id"];
		var keys = Object.keys(data);
		array_data.push(keys);
		for(var i = 0; i < snapshot.docs.length; i++){
			console.log("entro for asa");
			var temp = snapshot.docs[i].data()
			delete temp["galerie_id"];
			array_data.push(Object.values(temp));
		}
		return array_data;
	});
	
	if(data == null){
		return null;
	}
	console.log(data);
	return data;	
}


async function getDataForTable2(email_content){
	var ref = firebase.firestore().collection("users_ids");
	var user = await ref.where('email', '==', email_content).get().then((snapshot) => {
		var data = snapshot.docs[0].data();
		var name = data['name'];
		var type = data['type'];
		return [name,type];
	});
	
	var ref2 = firebase.firestore().collection("users").doc(user[1]).collection('kunstwerk');
	
	var data = await ref2.where('galerie_id', '==', email_content).get().then((snapshot) => {
		
		var array_data = []
		for(var i= 0; i < snapshot.docs.length; i++){
			array_data.push(snapshot.docs[i].data())
		}
		return array_data;
	});
	
	console.log(data);
	return data;	
}


// Data is in an array of arrays where [[keys], [row1],[row2],...[rown]]
function createTable(data){
	
	var table = document.getElementById("bootstrap-data-table-export");
	
	
	//Get the keys 
	var keys = data[0];
	console.log(keys);
	console.log("aqui");
	
	//Create header
    var header = table.createTHead();
	//Insert just 1 row on the header
	var row = header.insertRow(0);
	//Insert keys
	for(var i = 0; i< keys.length; i++){
		var val = "<th>" + keys[i] + "</th>";
		row.insertCell(i).outerHTML = val;
		row.classList.add("sorting_asc");
	}
	
	/*
	//Insert other rows , start 1 then 0 are the keys
	for(var i = 1; i< data.length; i++){
		var row = table.insertRow(i-1);
		//Insert values for row
		for(var p = 0; p < data[i].length ; p++){
			row.insertCell(i).innerHTML = data[i][p];
		}
	}
	*/

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

