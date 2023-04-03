// setting up url from our render file
const url = "https://surf-app.onrender.com/api/v1.0/surf"

// populating all surf spot locations into the dropdown
d3.json(url).then(function(data) {
  let selected = d3.select("#selDataset");
  console.log(data)
  for (let i = 0; i < data.length; i++) {
        selected.append('option').text(data[i].spot);
}});


// what we want to do: create a chart when new surf spot is selected
function chartCreate(spots) {
  d3.json(url).then(function(data){
    
    //finding the index of the selected spot
    let spotIndex = data.findIndex(data => data.spot === spots);
    
    // calling upon the array by the index
    let weather = data[spotIndex];
    
    // creating empty arrays to hold the data and labels as we loop
    let weatherData = [];
    let weatherLabels = [];
    
    // designating what labels we want dropped as they are not going to be shown in the charts
    let removeValFrom = [2,3, 4, 5, 6, 7,8,11,13];
    
    // drawing out the keys for the labels and add to new array weatherLabels
    for (const key in weather) {
      {
      weatherLabels.push(key)
      }
    };
    
    // filtering out unwanted labels
    weatherLabels= weatherLabels.filter(function(value, index) {
      return removeValFrom.indexOf(index) == -1;
    });
    
    // beginning loop to go through weather object by key and then normalize the values which we then push to weatherData
    for (let [key, value] of Object.entries(weather)) {
      if (key == "air_temp") {
        if (value <= 10.00 || value >= 43.00 ) 
        {
          weatherData.push(1)
        }
        else if (value >= 23.00 && value <= 27.00){
            weatherData.push(5);
          }
        else if (value <= 22.99 && value >= 18.00) {
          weatherData.push(4)
          }
        else if (value <= 17.99 && value >= 14.00){
          weatherData.push(3)
        }
        else if (value <= 13.99 && value >= 10.01){
          weatherData.push(2)
        }
        else{
          weatherData.push(0)
        }
      }
      if (key == "cloud_cover") {
        if (value >= 80.00 ) 
        {
          weatherData.push(1)
        }
        else if (value >= 0.00 && value <= 19.99){
            weatherData.push(5);
          }
        else if (value >= 20.00 && value <= 39.99) {
          weatherData.push(4)
          }
        else if (value <= 59.99 && value >= 40.00){
          weatherData.push(3)
        }
        else if (value <= 79.99 && value >= 60.00){
          weatherData.push(2)
        }
        else{
          weatherData.push(0)
        }
      }
      if (key == "visibility") {
        if (value <= 1.00 ) 
        {
          weatherData.push(1)
        }
        else if (value >= 24.00){
            weatherData.push(5);
          }
        else if (value <= 23.99 && value >= 16.00) {
          weatherData.push(4)
          }
        else if (value <= 15.99 && value >= 10.00){
          weatherData.push(3)
        }
        else if (value <= 9.99 && value >= 2.00){
          weatherData.push(2)
        }
        else{
          weatherData.push(0)
        }
      }
      if (key == "water_temp") {
        if (value <= 10.00 || value >= 30.00 ) 
        {
          weatherData.push(1)
        }
        else if (value >= 22.00 && value <= 26.00){
            weatherData.push(5);
          }
        else if (value <= 21.99 && value >= 18.00) {
          weatherData.push(4)
          }
        else if (value <= 17.99 && value >= 14.00){
          weatherData.push(3)
        }
        else if (value <= 13.99 && value >= 10.01){
          weatherData.push(2)
        }
        else{
          weatherData.push(0)
        }
      }
      if (key == "wave_height") {
        if (value <= 0.59 || value >= 3.01 ) 
        {
          weatherData.push(1)
        }
        else if (value >= 0.6096 && value <= 1.21){
            weatherData.push(5);
          }
        else if (value >= 1.22 && value <= 1.76) {
          weatherData.push(4)
          }
        else if (value >= 1.77 && value <= 2.10){
          weatherData.push(3)
        }
        else if (value <= 2.11 && value >= 3.00){
          weatherData.push(2)
        }
        else{
          weatherData.push(0)
        }
      }
      if (key == "wind_speed") {
        if (value <= 0.99|| value >= 8.33 ) 
        {
          weatherData.push(1)
        }
        else if (value >= 1.00 && value <= 2.00){
            weatherData.push(5);
          }
        else if (value >= 2.01 && value <= 4.01) {
          weatherData.push(4)
          }
        else if (value >= 4.00 && value <= 6.01){
          weatherData.push(3)
        }
        else if (value <= 8.32 && value >= 6.02){
          weatherData.push(2)
        }
        else{
          weatherData.push(0)
        }
      }
    };
    
   // creating sum value to use for middle of donut chart to give a score
    let sum = 0;
    weatherData.forEach(item => {
        sum += item;
    });
  console.log(sum);
    
  // calling in the name of the surf locale (spots) and data normalized (weatherData) into the radar spider chart  
  Highcharts.chart('container', {

    chart: {
      polar: true,
      type: 'line'
    },
  
  // calling spots into the title to populate title dynamically
    title: {
      text: `${spots}: Surf Radar Chart`,
      x: 0
    },
  
    pane: {
      size: '80%'
    },
  
    xAxis: {
      categories: weatherLabels,
      tickmarkPlacement: 'on',
      lineWidth: 0
    },
  
    yAxis: {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      min: 0
    },
    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical'
    },
  
    // calling in the weatherData for the spot selected and naming the line for the series legend
    series: [{
      name: `${spots} Score`,
      data: weatherData,
      pointPlacement: 'on'
    }],
  
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal'
          },
          pane: {
            size: '70%'
          }
        }
      }]
    }
  
  });

// creating the donut chart to give a rating of the normalized scores for ideal surfing spot
Highcharts.chart('container2', {
  colors: ["#0fc4d0", "#9be7cb", "#00aa99", "#E48080", "#ffdd54", "#0D96BA"],
  chart: {
      type: 'pie'
  },
  title: {
      text: `${spots}: Rating
      ${sum}/30`,
      verticalAlign: 'middle',
      floating: true,
      padding: 5
  },
  plotOptions: {
      pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
              enabled: true,
              format: '{point.name}: {y}'
          },
          showInLegend: true
      }
  },
  // calling in the weatherLabels and weatherData by index
  series: [{
      name: `${spots} Total Rating`,
      colorByPoint: true,
      innerSize: '75%',
      data: [{
          name: weatherLabels[0],
          y: weatherData[0]
      }, {
          name: weatherLabels[1],
          y: weatherData[1]
      }, {
          name: weatherLabels[2],
          y: weatherData[2]
      },
      {
        name: weatherLabels[3],
        y: weatherData[3]
      },
      {
      name: weatherLabels[4],
      y: weatherData[4]
    },
    {
    name: weatherLabels[5],
    y: weatherData[5]
    }
  ]
  }]
});

})};

// this activates when someone selects a spot from the dropdown
function optionChanged(spots) {
    chartCreate(spots);
};

//initializing charts right off the bat so it is there when page loads
function init() {
  d3.json(url).then(function (data) {
      chartCreate(data[0].spot);
  })
};
init();
