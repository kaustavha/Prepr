       
          // create onDeviceReady function but no functions need it here, 
          //perhaps a proper splash screen
       
          document.addEventListener("deviceready", onDeviceReady, false);

//Allow cross-domain connections
$(document).bind("mobileinit", function(){
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;

});

//Login function
function  validate(){
	loading("login", 0);
	var username = $("#username").val();
	var password =  $("#password").val();

	$.ajax({
		url : "http://staging.baryons.net/prepr_new/login/auth?jsoncallback=?",
		type : 'post',
		data : 'user=' + encodeURIComponent(username) + '&passwd=' + encodeURIComponent(password),
		dataType : 'jsonp',
		error : function(data) {
       //error code

       alert("Error: " + JSON.stringify(data));
   },
   success : function(data) {
   //success code
   var login = (data.login);
   if (login == "success") {   	
   	$.mobile.changePage( "index.html#one", { transition: "slideup", changeHash: true });
   	loading("login", 1);
   }
   else
   {
   	alert("Please check your username and password.");
   	loading("login", 1);
   }
}
});

}

//Functions for history
function addHist(itemId) {
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	var hour = date.getHours();
	var min = date.getMinutes();
	var timestamp = (day + "/" + month + " " + hour + ":" + min);
	window.localStorage.setItem(timestamp, itemId);
}

function showHist() {
	$('.datesHist').html('');
	$('.itemsHist').html('');
	$('.datesHist').append("Date:" + "<br />");
	$('.itemsHist').append("Item Id:" + "<br />");
	for(i=0; i<window.localStorage.length; i++){
		var date = window.localStorage.key(i);
        // keyname is now equal to "key"
        var value = window.localStorage.getItem(date);
        $('.datesHist').append(date + "<br />");
        $('.itemsHist').append(value + "<br />");
    }
}
function clearHist() {
	window.localStorage.clear();
	$('.datesHist').html('');
	$('.itemsHist').html('');
	$('.datesHist').append("Date:" + "<br />");
	$('.itemsHist').append("Item Id:" + "<br />");
}

 //Child browser plugin reference
 //Opens a in-app browser to the argument url
 function browser(url) {
 	var ref = window.open(url, '_blank', 'location=yes');
 }


 function iframe(src, id, appendto) {
 	var id = id,
 	src = src,
 	append = appendto;
 	$("#"+id).remove();
 	$('<iframe />');
 	$('<iframe />', {
 		name: id,
 		id: id,
 		class: id,
 		src: src
 	}).appendTo(append);        
 }
//Function to load dashboard 
function dash() {
	iframe("http://staging.baryons.net/prepr_new", "dashboard", "div.dashboard");

}   
//Loading Spinner  
function loading(ele, num) {
var timeOut = num;

	if (ele == "localView"){
		var top = 200,
		left = 240;
	}
	else{
		var top = 'auto',
		left = 'auto';
	}

	var opts = {
  lines: 8, // The number of lines to draw
  length: 20, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000) 
  top: top, // Top position relative to parent in px
  left: left // Left position relative to parent in px
};


	switch (timeOut)
{
	case 0:	
	var target = document.getElementById(ele);
    var spinner = new Spinner(opts).spin(target);	
	case 1:	
	spinner.stop();
	case 15000:
	setTimeout(function() {
		spinner.stop();
	}, timeOut);
}

}


//Function for scanning QR codes
//Checks selected choice and name entry, alerts in case of empty name, 
//opens a childbrowser if choice = remote, else changes to scan results page and appends iframes
function scan() {
	var server = "http://evening-fjord-2389.herokuapp.com/tv";
	var name = $("#name").val();
	var choice = $("input:radio[name=radio-choice]:checked").val(); 
	if(name) {
		if (choice == "remote")
		{

			window.plugins.barcodeScanner.scan( function(result) {
				addHist(result.text);
				browser(server+"/"+name+"/item/"+result.text);
			},
			function(error) {
				alert("Scanning failed: " + error);
			}
			);
		}
		else if (choice == "non-prepr") 
		{
			window.plugins.barcodeScanner.scan( function(result) {
		    addHist(result.text);
		    $('#scanText').html('');
		    $('#scanText').prepend('<p>'+result.text+'</p>');
		    $( "#popupScan" ).popup( "open" );
		}, 
			function(error) {
				alert("Scanning failed: " + error);
			}
			);
		}
		else
		{  		
			var serverFrame = server+"/"+name;

			iframe(serverFrame, "frame1", "#remoteView");
			$('#localView').prepend('<img id="frame2" src="img/logo.png" />');


			window.plugins.barcodeScanner.scan( function(result) {
				addHist(result.text);
				var localFrame = server+"/"+name+"/item/"+result.text;
				$.mobile.changePage( "index.html#scanResults", { transition: "slideup", changeHash: true });
				$("#remoteView").remove();
				loading("localView", 15000);
				setTimeout(function() {
					iframe(localFrame, "frame2", "#localView");

				}, 15000); 
//Wait 15seconds for tv initiliazation
},
function(error) {
	alert("Scanning failed: " + error);
}
);
		}
	}
	else 
	{
		if (choice == "non-prepr") 
		{
			window.plugins.barcodeScanner.scan( function(result) {
		    addHist(result.text);
		    $('#scanText').html('');
		    $('#scanText').prepend('<p>'+result.text+'</p>');
		    $( "#popupScan" ).popup( "open" );
		}, 
			function(error) {
				alert("Scanning failed: " + error);
			}
			);
		}
		else{
		alert("Please enter a name");  	
  	//If no name is entered and choice != non-prepr, prompt
  }
  }
}
