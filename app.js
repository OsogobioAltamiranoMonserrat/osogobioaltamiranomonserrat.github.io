	var OAUTH2_CLIENT_ID = '882852362186-bbbgpsklb6uk4sc28e46q36s1ong7k0g.apps.googleusercontent.com';	
	var API_KEY = 'AIzaSyA_cVPzK8SZxeNw8zpN9JIKXbedsivEKMM';
	var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
	var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
	
	var authorizeButton = document.getElementById('authorize-button');
    var signoutButton = document.getElementById('signout-button');

//CALENDAR

	function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }

      function initClient() {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: OAUTH2_CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
		  initMap();
        });
      }
	  			
	  
	  function makeApiCall(resource) {
				gapi.client.load('calendar', 'v3', function() {					
					var request = gapi.client.calendar.events.insert({
						'calendarId':'q87lk8n4erh4c7hvt91r2ehfv4@group.calendar.google.com',	
						"resource":	resource
					});
					request.execute(function(resp) {
						if(resp.status=='confirmed') {
						}
					});
				});
			}
	 
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }
	  

	var OAUTH2_SCOPES = [ 'https://www.googleapis.com/auth/youtube'];

	googleApiClientReady = function() {
		gapi.auth.init(function() {
		window.setTimeout(checkAuth, 1);
	  });
	}

	function checkAuth() {
	  gapi.auth.authorize({
		client_id: OAUTH2_CLIENT_ID,
		scope: OAUTH2_SCOPES,
		immediate: true
	  }, handleAuthResult);
	}
	function handleAuthResult(authResult) {
	  if (authResult && !authResult.error) {
		$('.pre-auth').hide();
		$('.post-auth').show();
		loadAPIClientInterfaces();
	  } else {
		$('#authorize-button').click(function() {
		  gapi.auth.authorize({
			client_id: OAUTH2_CLIENT_ID,
			scope: OAUTH2_SCOPES,
			immediate: false
			}, handleAuthResult);
		});
	  }
	}
	function loadAPIClientInterfaces() {
	  gapi.client.load('youtube', 'v3', function() {
	  });
	}

	//Buscar

	function onClientLoad() {
		gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
	}
	function onYouTubeApiLoad() {
		gapi.client.setApiKey('AIzaSyA_cVPzK8SZxeNw8zpN9JIKXbedsivEKMM');
	}

	var lista = new Array();
	var arre = new Array();
	var videosDiv= new Array(); 
	function search() {
			var cantidad = document.getElementById('cantidad').value;
			var query = document.getElementById('busquedaV').value;
			var request="";
			if(cantidad<51){
			request = gapi.client.youtube.search.list({
				q:query,
				part: 'snippet',
				maxResults: cantidad,
				order: "relevance",
			});
			request.execute(onSearchResponse);
			cantidad =0;
			query="";
			while(videosDiv.length>0){
					videosDiv.pop();
				}
			while(videos.length>0){
					videos.pop();
				}
			while(arre.length>0){
					arre.pop();
				}
			}
		}
		
		
		var videos = new Array();
		var _pagina = 0;
		var _next = document.createElement("button");
		_next.textContent="Next";
		var _back = document.createElement("button");
		_back.textContent="Back";
		
		
		function onSearchResponse(response) {
			var responseString = JSON.stringify(response.result);
			var responseYoutube = JSON.parse(responseString);
			var responseItems = responseYoutube.items;
			y(responseItems);
			
			var _cuerpo = document.getElementById("videos");
			_cuerpo.textContent="";
			if(responseItems.length<11){
				for (var i in responseItems) {
					var resource = insertar (responseItems[i],_cuerpo);
					makeApiCall(resource);
				}
				acomodar(videos,_cuerpo);
			}else{
				videosDiv.push(new Array());
				console.log(videosDiv);
				var cont = 0;
				var j=0;
				for (var i in responseItems) {
						if(j===10){
							cont++;
							if(i<(responseItems.length)){
							videosDiv.push(new Array())}
							j=0;
						}
						videosDiv[cont].push(responseItems[i]);
						j++;
				}
				for(var i in videosDiv[_pagina]){
					var resource = insertar (videosDiv[_pagina][i],_cuerpo);
					makeApiCall(resource);
				}
				acomodar(videos,_cuerpo);
				_cuerpo.appendChild(_next);
				_next.onclick = siguiente;
				_back.onclick = anterior;
				while(videos.length>0){
					videos.pop();
				}
			}	
				//
		  document.getElementById('calend').contentWindow.location.reload(true);
		}
		 
		 function siguiente(){
			 var _cuerpo = document.getElementById("videos");
			 _cuerpo.textContent="";
			 console.log(videos);
			 for(var i in videosDiv[_pagina+1]){
				 insertar(videosDiv[_pagina+1][i],_cuerpo);
			 }
			 _pagina ++;
			 acomodar(videos,_cuerpo);
			 if(_pagina<videosDiv.length-1){
			 _cuerpo.appendChild(_next);
			 }
			 if(_pagina>0){
			 _cuerpo.appendChild(_back);
			 }
			 while(videos.length>0){
					videos.pop();
				}
		 }
		 
		  function anterior(){
			 var _cuerpo = document.getElementById("videos");
			 _cuerpo.textContent="";
			 
			 for(var i in videosDiv[_pagina-1]){
				 insertar(videosDiv[_pagina-1][i],_cuerpo);
			 }
			 _pagina--;
			 acomodar(videos,_cuerpo);
			 if(_pagina<videosDiv.length){
			 _cuerpo.appendChild(_next);
			 }
			 if(_pagina>0){
			 _cuerpo.appendChild(_back);
			 }
			 while(videos.length>0){
					videos.pop();
				}
		 }
		 
		 
		 function insertar(objeto,cuerpo){
				var identificador = objeto.id.videoId; 
				var titulo = objeto.snippet.title;
				var descripcion = objeto.snippet.description;
				var publicacion = objeto.snippet.publishedAt;
								
				var informacion = titulo;
				var _tit = document.createElement("label");
				var _pub = document.createElement("label");
				var _iframe = document.createElement("iframe");
				_iframe.src= "//www.youtube.com/embed/" + identificador;
				
				var _div = document.createElement("div");
				_tit.textContent=titulo;
				_div.appendChild(_tit);
				_div.appendChild(document.createElement("br"));
				_pub.textContent="Publicado: "+publicacion.substr(0,10);
				_div.appendChild(_pub);
				_div.appendChild(document.createElement("br"));
				_div.setAttribute("id","video");
				
				_div.appendChild(_iframe);
				//agregar
				cuerpo.appendChild(_div);
				videos.push(_div);
				var resource = {
						"summary": titulo,
						"description" : "http://www.youtube.com/watch?v="+identificador,
						'start': {
						'dateTime': objeto.snippet.publishedAt,
						'timeZone': 'America/Mexico_City'
						},
						'end':{
						'dateTime': objeto.snippet.publishedAt,
						'timeZone': 'America/Mexico_City'
						}
					};
			return resource;
		 }
		 
		 function acomodar(arr,div){
			 if(arr.length<5){
				var tam=40;
				if(arr.length==2){tam = 20;}
				else{if(arr.length==3){tam = 5;}
				else{if(arr.length==4){tam = 1;}}}
				for(var i in arr){
					arr[i].style.marginLeft = ""+tam+"%";
				}
			 }
			 if(arr.length>4&&arr.length<11){
				var tam=1;
				var alt=100;
				var anc=70;
				for(var i in arr){
					arr[i].style.width=""+18+"%";
					arr[i].style.marginLeft = ""+tam+"%";
					arr[i].style.fontSize = 9+"px";
					arr[i].children[4].style.width = ""+anc+"%";
					arr[i].children[4].style.height = ""+alt+"px";
				}
			 }
			 
		 }
		 
		function y(arreglo){
			var ids="";
			for (var i in arreglo) {
				if(i < (arreglo.length-1)){
					ids=ids +arreglo[i].id.videoId+",";
				}
				else{
					ids=ids+arreglo[i].id.videoId;
				}
			}
			var url = "https://www.googleapis.com/youtube/v3/videos?id="+ids+"&part=player,snippet,recordingDetails&key=AIzaSyA_cVPzK8SZxeNw8zpN9JIKXbedsivEKMM";
			var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function(){
				if(xhr.readyState===4){
					if (xhr.status === 200){
						var obj = JSON.parse(this.responseText);
						for(var i=0; i<obj.pageInfo.totalResults;i++){
							if(obj.items[i].recordingDetails){
								if(obj.items[i].recordingDetails.location.latitude&&obj.items[i].recordingDetails.location.longitude){
									arre.push(obj.items[i]);
								}
							}
						}
						}
					}
					if(arre.length>0){
					Marcadores(arre);}
				}
				
				xhr.open("GET",url,true);
				xhr.send();	
		}

		
		//Maps

		function Marcadores(marcadores){
			var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 2,
			center: {lat: 0, lng: 0}
			});
			
			for(var j in marcadores){
			var info='<div id="informacion>"'+
			'Nombre del Video: '+marcadores[j].snippet.localized.title+'<br>'+
			'<iframe width="240" height="200" src="//www.youtube.com/embed/'+marcadores[j].id+'" frameborder="0" allow="autoplay; '+
			'encrypted-media" allowfullscreen></iframe>'+'<br>'+
			'URL: <a href =https://www.youtube.com/watch?v='+marcadores[j].id+'>https://www.youtube.com/watch?v='+marcadores[j].id+'</a>'+
			'</div>';
			
			var infowindow = new google.maps.InfoWindow({
			content: info,
			});
			
			var marker = new google.maps.Marker({
			position: {lat: marcadores[j].recordingDetails.location.latitude, lng: marcadores[j].recordingDetails.location.longitude},
			map: map,
			title: marcadores[j].snippet.localized.title,
			center:{lat: marcadores[j].recordingDetails.location.latitude, lng: marcadores[j].recordingDetails.location.longitude}
			});
			
			 marker.addListener('click', function() {
			infowindow.open(map, marker);
			});

			}
		}
		
		function initMap() {
				var map = new google.maps.Map(document.getElementById('map'), {
				  center: {lat: 0, lng: 0},
				  zoom: 2
				});
				var infoWindow = new google.maps.InfoWindow({map: map});
			  }

