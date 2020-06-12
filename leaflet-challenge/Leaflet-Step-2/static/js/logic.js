
// Store our API endpoint inside queryUrl
var earthQuakesAllDay = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var earthQuakesAllWeek = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var earthQuakesAllmonth = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var earthQuakesURL = earthQuakesAllDay;
var plates = "https://raw.githubusercontent.com/fraxen/TectonicPlates/master/GeoJSON/PB2002_boundaries.json";

d3.json(earthQuakesURL,function(earthQuakesData){
  console.log(earthQuakesData);
 
  function createCircleMarker(feature,latlng){
      let options = {
          radius:feature.properties.mag*4,
          fillColor: chooseColor(feature.properties.mag),
          color: "black",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.6
      }
      return L.circleMarker( latlng, options );

  }


  var earthQuakes = L.geoJSON(earthQuakesData,{
      onEachFeature: function(feature,layer){
          //layer.bindPopup("Place:"+feature.properties.place + "<br> Magnitude: "+feature.properties.mag+"<br> Time: "+new Date(feature.properties.time));
    layer.bindPopup(`<h2> <center>${feature.properties.title} </center></h2>\
          <hr><h3>Magnitude : ${feature.properties.mag} ${feature.properties.magType}</h3>\
          <h3>Place : ${feature.properties.place}</h3>\
          <h3>Title : ${feature.properties.type}</h3>\
          <hr><h4> Time : ${new Date(feature.properties.time)}</h4>`);
      },
      pointToLayer: createCircleMarker

  })

  d3.json(plates,function(response){
    //console.log(response);
    plates = L.geoJSON(response,{  
        style: function(feature){
            return {
                color:"orange",
                weight:2,
                fillColor: "red",
                fillOpacity:0.5
            }
        },      
        onEachFeature: function(feature,layer){
           // console.log(feature.coordinates);
           layer.bindPopup("Plate Name: "+feature.properties.Name);
        }
        
    });

    
    createMap(plates,earthQuakes);

    });

    
});

  function createMap(plates,earthQuakes) {

    
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 15,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });
  
    var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 15,
      id: "mapbox.light",
      accessToken: API_KEY
    });

    var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 15,
      id: "mapbox.outdoors",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Satellite": satellite,
      "Grayscale": grayscale,
      "Outdoors": outdoors
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Fault Lines": plates,
      Earthquakes: earthQuakes
    };
  
    // Create our map
    var myMap = L.map("map", {
      //center: [35.22,-80.84] ,
      center: [13.22, 80.84] ,
      zoom: 2,
      layers: [satellite, plates, earthQuakes]
    });
  
    
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    var info = L.control({
        position: "bottomright"
    });

    info.onAdd = function(){
        var div = L.DomUtil.create("div","legend");
        return div;
    }

    info.addTo(myMap);

    document.querySelector(".legend").innerHTML=displayLegend();

  }


  function chooseColor(mag){
    switch(true){
        case (mag<1):
            return "greenyellow";
        case (mag<2):
            return "yellow";
        case (mag<3):
            return "gold";
        case (mag<4):
            return "orange";
        case (mag<5):
            return "orangered";
        default:
            return "red";
    };
}

function displayLegend(){
    var legendInfo = [{
        limit: "Mag: 0-1",
        color: "greenyellow"
    },{
        limit: "Mag: 1-2",
        color: "yellow"
    },{
        limit:"Mag: 2-3",
        color:"gold"
    },{
        limit:"Mag: 3-4",
        color:"orange"
    },{
        limit:"Mag: 4-5",
        color:"orangered"
    },{
        limit:"Mag: 5+",
        color:"red"
    }];

    var header = "<h2>Magnitude</h2><hr>";
	var header = header.fontcolor("lime");
    var strng = "";
   
    for (i = 0; i < legendInfo.length; i++){
        strng += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
    }
    
    return header+strng;

}