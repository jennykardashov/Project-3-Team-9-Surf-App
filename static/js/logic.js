function createMap(surfs, waves, temps, winds) {

    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
      "Street Map": streetmap,
      "Topography Map": topo
    };
  
    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
      "Surf Locations": surfs,
      "Wave Height": waves,
      "Temperatures": temps,
      "Wind Speeds": winds
    };
  
    // Create the map object with options.
    let map = L.map("map", {
      center: [35, -120],
      zoom: 6.5,
      layers: [streetmap, surfs]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(response) {
  
    // Pull the "stations" property from response.data.
    // let stations = response.data.stations;
  
    // Initialize an array to hold bike markers.
    let surfMarkers = [];
    let waveMarkers = [];
    let tempMarkers = [];
    let windMarkers = [];
    
    function circleSize (wave) {
        return wave * 5000
    };

    function circleSizeWind(wind) {
        return wind * 2000
    }

    function circleColor (temp) {
        if (temp > 14)
            return "#C34A2C";
        if (temp >= 10)
            return "#F4A460";
        if (temp >= 7)
            return "#F6BE00";
        if (temp >= 3)
            return "#EEE8AA";
        else
            return "#9AFEFF"
    };
    
    function circleFill (wind) {
        if (wind > 12)
            return 1;
        if (wind >= 8)
            return .75;
        if (wind >= 4)
            return .5;
        if (wind >= 1)
            return .2;
        else
            return .1;
    };
    // Loop through the stations array.
    for (var i = 0; i < response.length; i++) {
      let data = response[i];
      // For each station, create a marker, and bind a popup with the station's name.
      let marker = L.marker([data.longitude, data.latitude])
        .bindPopup("<h2>" + data.spot + "<h2><h4>Wave Height: " + data.wave_height +  " M</h4><h4>Air Temperature: " + data.air_temp + " °C</h4><h4>Wind Speed: " + data.wind_speed + " m/s</h4>");
  
      // Add the marker to the bikeMarkers array.
      surfMarkers.push(marker);

      let waveMarker = L.circle([data.longitude, data.latitude], {
            radius: circleSize(data.wave_height),
            fillColor: "#00AA99",
            color: "#E48080",
            fillOpacity: 1,
            stroke: true
      }).bindPopup("<h2>" + data.spot + "<h2><h4>Wave Height: " + data.wave_height +  " M</h4><h4>Air Temperature: " + data.air_temp + " °C</h4><h4>Wind Speed: " + data.wind_speed + " m/s</h4>");
      waveMarkers.push(waveMarker);

      let tempMarker = L.circle([data.longitude, data.latitude],{
            radius: 12000,
            fillColor: circleColor(data.air_temp),
            color: circleColor(data.air_temp),
            fillOpacity: .8,
            stroke: true
      }).bindPopup("<h2>" + data.spot + "<h2><h4>Wave Height: " + data.wave_height +  " M</h4><h4>Air Temperature: " + data.air_temp + " °C</h4><h4>Wind Speed: " + data.wind_speed + " m/s</h4>");;
      tempMarkers.push(tempMarker);

      let windMarker = L.circle([data.longitude, data.latitude], {
        radius: circleSizeWind(data.wind_speed),
        fillColor: "#E48080",
        color: "#00AA99",
        fillOpacity: 1,
        stroke: true
      }).bindPopup("<h2>" + data.spot + "<h2><h4>Wave Height: " + data.wave_height +  " M</h4><h4>Air Temperature: " + data.air_temp + " °C</h4><h4>Wind Speed: " + data.wind_speed + " m/s</h4>");;
      windMarkers.push(windMarker)
    }
  
    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    createMap(L.layerGroup(surfMarkers),L.layerGroup(waveMarkers),L.layerGroup(tempMarkers),L.layerGroup(windMarkers));
  }
  
  // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
  d3.json("https://surf-app.onrender.com/api/v1.0/surf").then(data => createMarkers(data));