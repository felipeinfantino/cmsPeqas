let dropArea = document.getElementById('drop-area')

  dropArea.addEventListener('dragenter', preventDefaults, false);
  dropArea.addEventListener('dragleave', preventDefaults, false);
  dropArea.addEventListener('dragover', preventDefaults, false);
  dropArea.addEventListener('drop', preventDefaults, false);
  
  
  
  function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}


['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
});

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('highlight')
}


dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}


function handleFiles(event) {
	
	
	var fu1 = document.getElementById("fileElem");
	alert("You selecteddd " + fu1.value);
   window.alert("asd adasd");
   
    var file = event.target.files[0];
	 window.alert("file valu" + file.value);
	
   //var reader = new FileReader();
   var data;
  
  
		Papa.parse(fu1, {
				header: true,
				dynamicTyping: true,
				complete: function(results) {
				data = results;
			}
			});
  
  /*
  reader.onload = function(event)
        {
            
            //var contents = event.target.result;
            //var lines = contents.split('\n');
			
			var file =  document.getElementById("fileElem");//event.target.files[0];
			
			//alert("contenido " + contents);
			//var array = CSVtoArray(contents);
			
            //document.getElementById('container').innerHTML=contents;
			
			Papa.parse(file, {
				header: true,
				dynamicTyping: true,
				complete: function(results) {
				data = results;
			}
			});
			
			
			
			console.log(data);
			console.log("fe");
			
			
        };

   reader.readAsText(document.getElementById("fileElem").files[0]);
   */
   
  ([...files]).forEach(uploadFile)
  
  
}


function test(files){
	
	alert(files[0].name);
	Papa.parse(files[0], {
				header: true,
				dynamicTyping: true,
				complete: function(results) {
				blo(results);
			}
			});
	
	alert("done")
}

function blo(results){
	
	alert("entro");
	console.log(results);
}


function uploadFile(file) {
	
	let formData = new FormData()

  formData.append('file', file)
	window.alert("upload file ", formData.values())
  /*
  let url = 'YOUR URL HERE'
  let formData = new FormData()

  formData.append('file', file)

  fetch(url, {
    method: 'POST',
    body: formData
  })
  .then(() => { /* Done. Inform the user  })
  .catch(() => { /* Error. Inform the user  })
  
  */

}

function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    var a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
};
  
  
  
  
  



