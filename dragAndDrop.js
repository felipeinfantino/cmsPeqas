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
	
	var data = results["data"];
	for(var i = 0; i < data.length; i++){
		
		var keys = Object.keys(data[i]);
		var s = "";
		keys.forEach(function(x){
			s = s + x + " : " + data[i][x] + " \n";
		});
		alert(s);
		
		/*
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
	}
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

var uploadImgRef = storageRef.child('Galerien/berlinischegalerie_id/convertedImgs/'+ file.name);

uploadImgRef.put(file).then(function(snapshot) {
  alert('Uploaded a blob or file!');
});
	
}


  
  
  
  



