let score = 0

let panorama

let locapi = "https://api.3geonames.org/?randomland=yes";

var places = [
  [{ lat: 60.171001,  lng: 24.939350 },  {country: 'Finland'}], // Helsinki, Finland
  [{ lat: 48.858093,  lng: 2.294694 },   {country: 'France'}], // Paris, France
  [{ lat: 51.510020,  lng: -0.134730 },  {country: 'Great Britain'}], // London, Great Britain
  [{ lat: 41.8902,    lng: 12.4922 },      {country: 'Italy'}], // Rome, Italy
  [{ lat: 25.195302,  lng: 55.272879 },  {country: 'United Arab Emirates'}], // Dubai, United Arab Emirates
  [{ lat: 1.283404,   lng: 103.863134 },  {country: 'Singapore'}], // Marina Bay, Singapore
  [{ lat: 29.976768,  lng: 31.135538 },  {country: 'Egypt'}], // Cairo, Egypt
  [{ lat: 40.757876,  lng: -73.985592 }, {country: 'United States'}],
  [{lat: 15.82441616,  lng: 101.838303}, {country: 'Thailand'}],
  [{lat: 58.49505234,  lng: 5.807278}, {country: 'Norway'}],
  [{lat: 16.87000084,  lng: -99.817085}, {country: 'Mexico'}],
  [{lat: 55.55073547,  lng: 22.265993}, {country: 'Lithuania'}],
  [{lat: 42.11227798,  lng: -1.822601}, {country: 'Spain'}],
  [{lat: 45.71424866,  lng: 21.206326}, {country: 'Romania'}],
  [{lat: 38.34711075,  lng: 122.905979}, {country: 'Greece'}],
  [{lat: 24.86325073,  lng: 55.178013}, {country: 'UAE'}],
  [{lat: 45.38508987,  lng: 14.354772}, {country: 'Croatia'}],
  [{lat: 48.12480164,  lng: 17.076136}, {country: 'Slovakia'}],
  [{lat: 59.35496521,  lng: 13.787681}, {country: 'Sweden'}],
  [{lat: 46.58872223,  lng: 118.435047}, {country: 'Hungary'}],
  [{lat: 52.53569794,  lng: 16.469717}, {country: 'Poland'}],
  [{lat: -18.77832222,  lng: 145.802628}, {country: 'Australia'}],

  [{lat: 145.802628,  lng: -90.656395}, {country: 'USA'}],
  [{lat: -5.21885109,  lng: -39.303082}, {country: 'Brazil'}],
  [{lat: 10.98095989,  lng: 105.177795}, {country: 'Cambodia'}],
  [{lat: 51.43020630,  lng: 24.600740}, {country: 'Ukraine'}],
  [{lat: 38.87070847,  lng: -7.204943}, {country: 'Portugal'}],
  [{lat: -25.03465843,  lng: 23.237131}, {country: 'Botswana'}],
  [{lat: 54.84004211,  lng: -8.473377}, {country: 'Ireland'}],
  [{lat: 49.08654022,  lng: 14.844007}, {country: 'Czech Republic'}],
  [{lat: 51.94570160,  lng: 4.441118}, {country: 'Netherlands'}],
  [{lat: 8.15388107,  lng: -76.039757}, {country: 'Colombia'}],
  [{lat: -25.30661583,  lng: 27.192694}, {country: 'South Africa'}],
  [{lat: -40.23200226,  lng: 175.733154}, {country: 'New Zealand'}],
  [{lat: 46.51375580,  lng: 14.860552}, {country: 'Slovenia'}],
  [{lat: 58.65501404,  lng: 35.973080}, {country: 'Russia'}],

  [{lat: 27.28003120,  lng: 89.304794}, {country: 'Bhutan'}],
  [{lat: 43.38306046,  lng: 0.327032}, {country: 'France'}],
  [{lat: -39.63227081,  lng: -66.492424}, {country: 'Argentina'}],
  [{lat: 50.47336960,  lng: 30.480471}, {country: 'Ukraine'}],
  [{lat: 41.26000214,  lng: 174.057709}, {country: 'New Zealand'}],
  [{lat: 2.89084411,  lng: 101.927063}, {country: 'Malaysia'}],
  [{lat: 52.57576370,  lng: -9.252982}, {country: 'Ireland'}],
  [{lat: 1.37254596,  lng: 103.856163}, {country: 'Singapore'}],
  [{lat: 23.97614479,  lng: 120.586800}, {country: 'Taiwan'}],
  [{lat: 32.95507431,  lng: 35.211445}, {country: 'Israel'}],
  [{lat: 61.45774078,  lng: 74.656372}, {country: 'Russia'}],
  [{lat: 63.74209595,  lng: -68.547180}, {country: 'Canada'}],
  [{lat: 58.62883759,  lng: 25.654791}, {country: 'Estonia'}],
  [{lat: -45.83908081,  lng: -71.850525}, {country: 'Chile'}],


]

let currentPlace = places[Math.floor(Math.random() * (places.length))]  // Pick a random place to be spawned
let coordinates = currentPlace[0] // Get coordinates
let country = currentPlace[1].country.toLowerCase()

let reconfigure = () => { 
  document.getElementById("score").innerHTML = "Score: " + score
  currentPlace = places[Math.floor(Math.random() * (places.length))]
  coordinates = currentPlace[0]
  country = currentPlace[1].country.toLowerCase()

  initialize()
}

const stopgame= () => {
  var x = document.getElementById("street-view"); 
 
if (x.style.display === "none") { 
x.style.display = "block";
reconfigure();

} else { 
x.style.display = "none"; 
alert ("Game Over! You scored " + score);
score = 0;
reconfigure();
         


} 
var txt = document.getElementById('quitbtn').innerText
if (txt == "STOP/EXIT"){
  document.getElementById('quitbtn').innerText = 'START'
}
else {
  document.getElementById('quitbtn').innerText = 'STOP'
}


    }

    const giveinfo = () => {
      alert('Navigate through the given street view to identify the correct country name by recognizing the surroundings. \nEarn more and more points as you rise through each particular location.\nPlay and learn global cultural and geographical features of different countries around the world ')
    }    

    const guess= () => {
      var guess = window.prompt("Where are we? ").toLowerCase()
      if(guess.toLowerCase() === country.toLowerCase()) {
        score++
        alert("Correct! Current Score: " + score)
        reconfigure()
      } else {
        
        alert("Incorrect! Current Score: " + score)
        reconfigure()
      }
    }

    function initialize() {
       
      panorama = new google.maps.StreetViewPanorama(
        document.getElementById("street-view"),
        {
          position: coordinates,
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
          linksControl: false,
          panControl: false,
          enableCloseButton: false,
          addressControl: false
        }
      )
      
    }    

    var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
        function initMap() {
            var dumbo = {lat: 10.700802, lng:89.987602};
            var mapOptions = {
                center: dumbo,
                zoom: 3
            };

           
            var googlemap = new google.maps.Map(document.getElementById("map"), mapOptions);
            var markr = new google.maps.Marker({
    position: myLatlng,
    map: googlemap,
    title: "My Guess!",
  });
            markr.setMap(googlemap)
            

            google.maps.event.addListener(googlemap, 'click', function(event) {
   placeMarker(event.latLng);
  });
}

function placeMarker(location) {
            
  var marker = new google.maps.Marker({
      position: location, 
      map: googlemap
  });
  googlemap.panTo(location)
}