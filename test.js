// the data table itself
        var dataTable = null;


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
    
	
	console.log("ahiva logg");
	 var a = await getDataForTable("finfantino@peqas.com");
	console.log("ahiva")
	console.log(a)
    
	var b = convertData(a);
	
	console.log(b);
	
	dataTable = jQuery("#dataTable").raytable({
		datasource: { data: [], keyfield: 'id' },
		columns: b ,
		pagesize: 10,
		maxPageButtons: 13,
		rowNumbers: true,
		rowClickHandler: rowAction
	});

	jQuery(".glyphicon").css('cursor', 'pointer');
            
    await doLoad(jQuery("#dataTable"));
	
	
	
	} else {
   // window.location = "index.html";
   var a = await getDataForTable("finfantino@peqas.com");
	console.log("ahiva")
	console.log(a)
    
	var b = convertData(a);
	
	console.log(b);
	
	dataTable = jQuery("#dataTable").raytable({
		datasource: { data: [], keyfield: 'id' },
		columns: b ,
		pagesize: 10,
		maxPageButtons: 13,
		rowNumbers: true,
		rowClickHandler: rowAction
	});

	jQuery(".glyphicon").css('cursor', 'pointer');
            
    await doLoad(jQuery("#dataTable"));
			
                                 
       
   
}
});



function convertData(data){
		
	var keys = data[0];
	
	var convertedData = [];
	
	for(var i = 0; i< keys.length ; i++){
		convertedData.push({
			field: keys[i], title: keys[i], sort: true
		});
	}
	
	convertedData.push({ title: "Delete", icons: [{ glyph: "glyphicon-trash", handler: iconAction, data: "id" }] });
	
	return convertedData;
	
}

//TODO id not email
async function getDataForTable(email_content){
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
		var data = snapshot.docs[0].data();
		var keys = Object.keys(data);
		array_data.push(keys);
		for(var i = 0; i < snapshot.docs.length; i++){
			console.log("entro for");
			array_data.push(Object.values(snapshot.docs[i].data()));
		}
		return array_data;
	});
	
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

		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		// load some data
        async function doLoad(sender) {
			var data = await getDataForTable2("finfantino@peqas.com");
			
            dataTable.data(data,'id');
        }

		// icon clicked event handler
        function iconAction(event)
        {
            // jquery to get the record ID back out
            var data = jQuery(event.target).data('ray-data');
            alert('glyph icon data is ' + data);
            //alert('You clicked the icon with data = ' + event.data.id + ' on row ' + event.data.rowIdx );
        }
        
        // row clicked handler
        function rowAction(event)
        {
            // jquery to get the record ID back out
            //var id = jQuery(event.target).data('ray-key');
            alert('You clicked row ' + event.data.rowIdx + ' with object ID ' + event.data.id );
        }
        
        // boolean handler to determine if the cell content is rendered
    	function isManager(item)
    	{
    		return (item.grade > 4);
    	}
    	
    	// custom format handler
    	function parseDate(item)
    	{
    		// source is ISO 8601
    		var d = new Date(item.birthDate);
    		return d.toDateString();
    	}
		
		
		
		