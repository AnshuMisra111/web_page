var appController = angular.module('myApp',['chart.js']);

var dataObj = new Object();
var wishImage = "";
var wishState = "";
var wishCity = "";
var progressflag = false;
var globalTemp = "";
var globalSummary = "";
var mainCity = "";
var mainState = "";
var cloud_Icons = [];
cloud_Icons["clear-day"] = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png";
cloud_Icons["clear-night"]= "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png";
cloud_Icons["rain"] = "https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png";
cloud_Icons["snow"] = "https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png";
cloud_Icons["sleet"] = "https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png";
cloud_Icons["wind"] = "https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png";
cloud_Icons["fog"] = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png";
cloud_Icons["cloudy"] = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png";
cloud_Icons["partly-cloudy-day"] = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png";
cloud_Icons["partly-cloudy-night"] = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png";
//var searchResult = new Object();

var chartLabels = {
  "temperature" : "Fahrenheit",
  "pressure" : "Millibars",
  "humidity" : "% Humidity",
  "ozone" : "Dobson Unit",
  "visibility" : "Miles (Maximum 10)",
  "windSpeed" : "Miles per Hour"
}

var tableHeading = ["#","Image","City","State","WishList"];

function enableSearchButton(){

  var checkbox = document.getElementById("gridCheck1");
  var city = document.getElementById("city");
  var street = document.getElementById("street");
  var state = document.getElementById("sel1");
  if(checkbox.checked){
      document.getElementById("searchButton").disabled = false;
      city.value = "";
      street.value = "";
      state.selectedIndex = 0;
      city.disabled = true;
      street.disabled = true;
      state.disabled = true;
    }
    else{
      city.disabled = false;
      street.disabled = false;
      state.disabled = false;
      var index = state.selectedIndex;
      console.log("came to log"+city.value+" "+street.value+" "+index);
      if(city.value && street.value && index>0){
         document.getElementById("searchButton").disabled = false;
       }
       else{
         document.getElementById("searchButton").disabled = true;
       }
    }

}

function callWeather(city,state,rowNumber){
  console.log(city+" "+state);
  //angular.element(document.getElementById("searchButton")).scope().weatherSearch();
  angular.element(document.getElementById("searchButton")).scope().globalCall("1246",city,state);
  //document.getElementById('searchResult').style.display="block";
  document.getElementById("resultButton").style["background-color"] = "#6592AD";
  document.getElementById("favouriteButton").style["background-color"] = "white";
  document.getElementById("resultButton").style["color"] = "white";
  document.getElementById("favouriteButton").style["color"] = "black";
  var chart2 = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    exportEnabled: true,
    title: {
      text: "Weekly Weather"
    },
    axisX: {
      title: "Days"
    },
    axisY: {
      title: "Temperature in Fahrenheit",
      interval: 10,
      gridThickness: 0
    },
    legend :{
      verticalAlign: "top"
    },
    data: [{
      type: "rangeBar",
      color: "#9AD1F1",
      showInLegend: true,
      legendText : "Daywise Temperature Range",
  		yValueFormatString: "#0.#",
  		indexLabel: "{y[#index]}",
  		toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
      dataPoints: []
    }]
  });
  chart2.render();
  document.getElementById('favourite').style.display="none";
  document.getElementById('card-body').innerHTML = "";
  $('#mainPath').css({fill: "#ffff00"});
  document.getElementById('mainPath').flag = true;
  document.getElementById('mainPath').rowNumber = rowNumber;


  //console.log(d.getAttribute("city")+" "+d.getAttribute("state"));
}

appController.controller('myAppController',['$scope','$http',function($scope,$http) {


 $scope.globalCall = function(street,city,state){

   document.getElementById('progressBar2').style.display = "block";
   $scope.progressBarTab();
   var mainData = $scope.globalSearch(street,city,state);
   mainData.then(function(data){
     data = mainData.$$state.value;
     parser = new DOMParser();
     xmlDoc = parser.parseFromString(data,"text/xml");
     var lat = xmlDoc.getElementsByTagName("geometry")[0].getElementsByTagName("location")[0].getElementsByTagName('lat')[0].childNodes[0].nodeValue;
     var long = xmlDoc.getElementsByTagName("geometry")[0].getElementsByTagName("location")[0].getElementsByTagName('lng')[0].childNodes[0].nodeValue;
     $scope.weatherData(lat,long);
   });

 }



  $scope.updateSearchFlag =  function(){
    //console.log("came here");
    document.getElementById("resultButton").style["background-color"] = "#6592AD";
    document.getElementById("favouriteButton").style["background-color"] = "white";
    document.getElementById("resultButton").style["color"] = "white";
    document.getElementById("favouriteButton").style["color"] = "black";
    $scope.searchFlag = false;
    if(!document.getElementById("searchButton").disabled){
         document.getElementById('searchResult').style.display="block";
       }
    document.getElementById('favourite').style.display="none";
    document.getElementById("warningAlert").style.display = "none";
  }

  $scope.updateFavouriteFlag = function(){
    document.getElementById("resultButton").style["background-color"] = "white";
    document.getElementById("favouriteButton").style["background-color"] = "#6592AD";
    document.getElementById("resultButton").style["color"] = "black";
    document.getElementById("favouriteButton").style["color"] = "white";
    $scope.searchFlag =  true;
    document.getElementById('searchResult').style.display="none";
    document.getElementById('favourite').style.display="block";
    var storage =  window.localStorage;

    if(storage.getItem("table")==null){
      document.getElementById("warningAlert").style.display = "block";
    }
    else{
      document.getElementById("warningAlert").style.display ="none";
    }
  }



  var key = null;
  var hourly_weatherData = [];


  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data:{
      labels :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
      datasets:[{
        label:"temperature",
        backgroundColor: "rgba(154,209,241,0.5)",
        borderWidth: 0,
        data:[]
      }]
    },
    options: {
  scales: {
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Fahrenheit'
      }
    }],
    xAxes:[{
      scaleLabel :{
        display: true,
        labelString: 'Time Difference from current hour'
      }
    }]
  },
  legend :{
    display: true,
            labels: {

            }
  }
}
  });
  myChart.update();


 $scope.changeText = function(){
   //$scope.twitterText = "The current temperature at"+ WishCity +" is"+ globalTemp +". The weather conditions are"+ globalSummary +" Website: URL #CSCI571WeatherSearch";
  // var link = document.createElement("a");
  // link.href = "https://csci571.com/";
  // var text = document.createTextNode("#CSCI571WeatherSearch");
  // link.appendChild(text);
   var link = "https://csci571.com/#CSCI571WeatherSearch";
    location.hash = "CSCI571WeatherSearch";
   document.getElementById("twitterButton").href = "https://twitter.com/intent/tweet?text="+"The current temperature at "+ wishCity +" is "+ globalTemp +". The weather conditions are "+ globalSummary+"&hashtags=CSCI571WeatherSearch";
 }

  $scope.updateFavourite = function(){

    console.log(document.getElementById('mainPath').flag);
    if(!document.getElementById('mainPath').flag){
      document.getElementById('mainPath').flag = true;
    //  document.getElementById('firstSvg').display = "Block";
    //  document.getElementById('SecondSvg').display = "None";
    document.getElementById("mainPath").style.fill = "#ffff00";
    //$('#mainPath').css({fill: "#ffff00"});
  }
  else{

      document.getElementById('mainPath').flag = false;
      document.getElementById("mainPath").style.fill = "none";
      document.getElementById("mainPath").style.stroke = "#646464";
      //$('#mainPath').css({fill:"none", stroke: "#646464"});
      if(document.getElementById('mainPath').rowNumber!=null){
          $scope.delElementFromTable(document.getElementById('mainPath').rowNumber);
          document.getElementById('mainPath').rowNumber = null;
      }
    //  document.getElementById('secondSvg').display = "Block";
    //  document.getElementById('firstSvg').display = "None";
    //$('#mainPath').css({fill: "none", border: "1px solidBlack"});
  }
   var storage = window.localStorage;
   var table = document.getElementById("myTable");

   if(document.getElementById('mainPath').flag) {
      //var storage = window.localStorage;
      if(storage.getItem('table')==null){
        //var table = document.getElementById("myTable");
        $scope.makeTableHead(table);
        var data = [table.rows.length,wishImage,wishCity,wishState];
        $scope.makeTable(table,data);
        var tableData = [];
        tableData[tableData.length] = data;
        storage.setItem("table", JSON.stringify(tableData));

      }
      else{
        //table = JSON.parse(storage.getItem('table'));
        var data = [table.rows.length,wishImage,wishCity,wishState];
        var tableData = JSON.parse(storage.getItem('table'));
        tableData[tableData.length] = data;
        $scope.makeTable(table,data);
        storage.setItem("table", JSON.stringify(tableData));
      }

   }

  }


  $scope.delElementFromTable = function(rowNumber){
    var storage = window.localStorage;
    var table = document.getElementById("myTable");
    //table.deleteRow(rowNumber);
    var tableEntry = JSON.parse(storage.getItem('table'));
    var newEntry = [];
    var counter = 1;
    for(var i=0;i<tableEntry.length;i++){
      //console.log("tableNumber = "+i);
      //table.deleteRow(i+1);
      if(i!=rowNumber-1){
           newEntry[newEntry.length] = tableEntry[i];
           newEntry[newEntry.length-1][0] = counter;
           counter++;
         }
    }
  //  tableEntry = newEntry;
  //  storage.setItem('table',JSON.stringify(tableEntry));

    console.log(i<table.rows.length);
    table.innerHTML = "";
    for(var i=0;i<table.rows.length;i++){
       //newEntry[i][0] = i;
       console.log("tableNumber = "+i);
       table.deleteRow(i);
    //  var cell = table.rows[i];
    //  cell.cell[0].innerHTML = i;
    }

    tableEntry = newEntry;
    $scope.makeTableHead(table);
    for(var i=0;i<newEntry.length;i++){
      $scope.makeTable(table,tableEntry[i]);
    }
    if(table.rows.length>1){
      storage.setItem('table',JSON.stringify(tableEntry));
    }
    else{
      table.innerHTML = "";
      storage.clear();
      document.getElementById("warningAlert").style.display = "block";
    }


  }

  $scope.makeTableHead = function(table){

    var tableHead = table.createTHead();
    var row = tableHead.insertRow();
    for(var key of tableHeading) {
     var th = document.createElement("th");
     var text = document.createTextNode(key);
     th.appendChild(text);
     row.appendChild(th);

    }
  }

  $scope.callWeather = function(d){
    console.log(d.city+" "+d.state);
  }


  $scope.makeTable = function(table,data){
    var storage = window.localStorage;
    var row = table.insertRow();
    for(var i=0; i<data.length;i++){
        var cell = row.insertCell();
        var cellText = document.createTextNode(data[i]);
        if(i==1){
          var ref = document.createElement("img");
          ref.src = data[i];
          ref.style.width = "40px";
          ref.style.height = "40px";
          cell.appendChild(ref);
        }
      else{
        if(i==2){
          var ref = document.createElement("a");
          //ref.src = data[i];
          ref.city = data[2];
          ref.state = data[3];
          ref.number = data[0];
          //ref["ng-controller"]="myAppController";
          ref.onclick = function(){
            document.getElementById("gridCheck1").checked = false;
            callWeather(this.city,this.state,this.number);
          }
          ref.appendChild(cellText);
          cell.appendChild(ref);
        }
        else{
        cell.appendChild(cellText);
      }
    }
    }

    //var lastCell = row.insertCell;

    var lastCell = document.createElement("td");
    var svgLink = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z\"/><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg>";
    //lastCell.city = data[2];
    //lastCell.state = data[3];
    lastCell.number = data[0];
    lastCell.onclick = function(){
        $scope.delElementFromTable(this.number);
    }
    lastCell.insertAdjacentHTML("beforeend",svgLink);

    //var lastCell = "<td><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z\"/><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg></td>";
    //lastCell.city =
    row.appendChild(lastCell);
    //row.insertAdjacentHTML("beforeend",lastCell);

    //storage.setItem("table", JSON.stringify(table));

  }


  $scope.complete = function(city) {

    var options = [];
    $scope.hidden = false;
  //  var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+city+"&types=(cities)&language=en&key=AIzaSyBy2MEexehHdEUnjPn5ViNLvv5YwKzFyBI";
    var url = "https://newproject-1573689447678.appspot.com/Autocomplete?keyword="+city;


    $http.get(url).then(function(cityList) {

      cityList = cityList["data"]["predictions"];
      for(element of cityList){
        options.push(element["structured_formatting"]["main_text"]);
      }

    });
    $scope.filterCity = options;
    return options;
  }

  $scope.fillTextBox = function(city) {
    $scope.city = city;
    $scope.hidden = true;
  }

  $scope.progressBarTab = function(){
  var percent = 50;
  timerId = setInterval(function() {
        percent += 25;
        document.getElementById('progressBar1').style.width = percent+"%";
      //  flag = true;
      if(percent>100){
      clearInterval(timerId);
      $scope.UpdateProgressTab();
    }

    }, 1000);
    //document.getElementById('progressBar2').style.display = "none";
  }

  $scope.UpdateProgressTab = function(){
    document.getElementById('progressBar2').style.display = "none";
    document.getElementById('searchResult').style.display="block";
    //progressflag= true;
  }

  $scope.weatherSearch = function() {
    document.getElementById('progressBar2').style.display = "block";
    document.getElementById('favourite').style.display="none";
    document.getElementById("warningAlert").style.display = "none";
    $scope.progressBarTab();

    //wishState = "California";
    //console.log(document.getElementById("city").value);
    if(!document.getElementById("city").disabled){
        var city = document.getElementById("city").value;
        var street = document.getElementById("street").value;
        var stateList = document.getElementById("sel1");
        var state = stateList[stateList.selectedIndex].value;
        var mainData = $scope.globalSearch(street,city,state);
        mainData.then(function(data){
          data = mainData.$$state.value;
          if(data.status!="ZERO_RESULTS"){
           console.log(data);
          parser = new DOMParser();
          xmlDoc = parser.parseFromString(data,"text/xml");
          var lat = xmlDoc.getElementsByTagName("geometry")[0].getElementsByTagName("location")[0].getElementsByTagName('lat')[0].childNodes[0].nodeValue;
          var long = xmlDoc.getElementsByTagName("geometry")[0].getElementsByTagName("location")[0].getElementsByTagName('lng')[0].childNodes[0].nodeValue;
          $scope.weatherData(lat,long);
        }
        else{
          document.getElementById("invalidAddressAlert").style.display = "block";
        }
        });
    }
    else{
    var mainData = $scope.localSearch();

    mainData.then(function(data){
      data = mainData.$$state.value;
      if(data!=null){
      var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+data['lat']+","+data['lon']+"&key=AIzaSyBy2MEexehHdEUnjPn5ViNLvv5YwKzFyBI";
      $http.get(url).then(function(data){
        var address = data["data"]["results"][0]["formatted_address"].split(",");
        mainCity = address[address.length-3].trim();
        mainState = address[address.length-2].trim().split(" ")[0];

        //console.log("state data is = ");
        //console.log(mainCity+" "+mainState);
      });

      $scope.weatherData(data['lat'],data['lon']);
    }
    });

  //  console.log("mainData is ="+mainData);
  //  $scope.weatherData(mainData['lat'],mainData['lon']);
  }


  }

  $scope.globalSearch = function(street,city,state){
    var address = "";
    var streetComponent = street.split(" ");
    for (var i = 0; i< streetComponent.length;i++){
       //console.log(streetComponent[i]);
       if(address){
         address = address + "+" + streetComponent[i];
       }
      else {
        address =  address + ""+ streetComponent[i];
      }
     }

    address = address + ",";
    mainCity = city;
    var cityComponent = city.split(" ");

    for (var i = 0; i< cityComponent.length;i++){
       //console.log(cityComponent[i]);
       if(address){
         address = address + "+" + cityComponent[i];
       }
      else {
        address =  address + ""+ streetComponent[i];
      }
     }
     address = address + ",";
     for(var element of $scope.states){
       //console.log(element["State"]+" "+stateList.options[stateList.selectedIndex].value);
       if(element["State"]==state){
         address = address+"+"+ element["Abbreviation"];
         mainState = element["Abbreviation"];
         break;
       }
     }
     //address = address+"+"+ stateList.options[stateList.selectedIndex].Abbreviation;
     //console.log("address is ="+address);

     var url = "https://maps.googleapis.com/maps/api/geocode/xml?address="+address+"&key=AIzaSyBy2MEexehHdEUnjPn5ViNLvv5YwKzFyBI" ;
     var mainData = $http.get(url).then(function(data){
       //console.log(data['data']);
       //console.log(typeof data['data']);
       if(data!=null){
           return data['data']
         }
        else{
          document.getElementById("invalidAddressAlert").style.display = "block";
          return null;
        }

     }, function(error){
       document.getElementById("invalidAddressAlert").style.display = "block";
       return null;
     }
   );
      return mainData;
  }

  $scope.currentWeather = function(data,timezone){

    var mainDoc = document.getElementById("card-body");
    var cloudCover = data['cloudCover'];
    var ozone = data['ozone'];
    var temperature = data['temperature'];
    var pressure = data['pressure'];
    var humidity = data['humidity'];
    var windSpeed = data['windSpeed'];
    var visibility = data['visibility'];
    var summary = data['summary'];

    globalTemp = temperature;
    globalSummary = summary;

    console.log(data);
    state="CA";
    var url = "https://newproject-1573689447678.appspot.com/StateSeal?state="+mainState;
    $http.get(url).then(function(jsonData){
     console.log(jsonData['data']['items'][0]['link']);
     wishImage = jsonData['data']['items'][0]['link'];
     document.getElementById("currentWeatherImg").src = wishImage;
     var box = document.createElement("div");
     box.id= "current_weather";
     var cityName = "Los Angeles";
     wishCity = mainCity;
     for(var element of $scope.states){
       if(element["Abbreviation"]==mainState){
         wishState = element["State"];
         break;
       }
     }
     //var place = "<div style=\"position:relative;left:15px;;font-size:50px;color:black; display\">"+weatherObj.cityName+"<div>";
     var timezoneele = "<div id = \"timezone\"><span style = \"font-size:220%;\">"+mainCity+"</span><br><span style = \"font-size:220%;margin-top:1%;\">"+timezone+"</span></div>";
     var temperatureele = "<div id=\"temperature\" style=\"position:relative;top:50px;left:15px;font-size:220%\">"+temperature+"<img src = \"https://cdn3.iconfinder.com/data/icons/virtual-notebook/16/button_shape_oval-512.png\" style=\"height:1.75%; width:1.75%; position:relative; top:-0.40em\;margin-left:0.5%\"><span style=\"margin-left:0.5%\">F</span></div>";
     var summaryele = "<div id=\"summary\" style=\"position:relative;top:60px;font-size:120%;\"><b>"+summary+"</b></div>";
     var humidityele = "<span title=\"Humidity\" style = \"display:inline-block; position:relative;left:10%;text-align:center;\"><img src = \"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-16-512.png\" style = \"height:35px; width:35px;\"></img><br><b>"+humidity+"</b></span>";
     var pressureele = "<span title=\"Pressure\" style = \"display:inline-block; position:relative;left:30%;text-align:center;\"><img src = \"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-25-512.png\" style = \"height:35px; width:35px;\"></img><br><b>"+pressure+"</b></span>";
     var windSpeedele = "<span title=\"Wind Speed\"  style = \"display:inline-block; position:relative;left:50%;text-align:center;\"><img src = \"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-27-512.png\" style = \"height:35px; width:35px;\"></img><br><b>"+windSpeed+"</b></span>";
     var visibilityele = "<span title=\"Visibility\"  style = \"display:inline-block; position:relative;left:70%;text-align:center;\"><img src = \"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-30-512.png\" style = \"height:35px; width:35px;\"></img><br><b>"+visibility+"</b></span>";
     var cloudCoverele = "<span title=\"Cloud Cover\" style = \"display:inline-block; position:relative;left:90%;text-align:center;\"><img src = \"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-28-512.png\" style = \"height:35px; width:35px;\"></img><br><b>"+cloudCover+"</b></span>";
     var ozoneele = "<span title=\"Ozone\" style = \"display:inline-block; position:relative;left:110%;text-align:center;\"><img src = \"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-24-512.png\" style = \"height:35px; width:35px;\"></img><br><b>"+ozone+"</b></span>";
     var lastLayer = "<div style=\"position:absolute;bottom:0px\">"+humidityele+pressureele+windSpeedele+visibilityele+cloudCoverele+ozoneele+"</div>";

     //box.insertAdjacentHTML("beforeend",place);
     box.insertAdjacentHTML("beforeend",timezoneele);
     box.insertAdjacentHTML("beforeend",temperatureele);
     box.insertAdjacentHTML("beforeend",summaryele);
     box.insertAdjacentHTML("beforeend",lastLayer);
     mainDoc.appendChild(box);

    });


  }

  $scope.hourlyWeather = function(data){
      chartData = data;
      if(!key){
        var e = document.getElementById("sel2");
        key = e.options[e.selectedIndex].value;
      }
      dataObj.data = data;
      $scope.getChartData();
      //console.log(data);
  }

  function sortFunction(a, b) {
      if (a[0] === b[0]) {
          return 0;
      }
      else {
          return (a[0] < b[0]) ? -1 : 1;
      }
  }

  $scope.getChartData= function(){

      if(!key){
        var e = document.getElementById("sel2");
        key = e.options[e.selectedIndex].value;
      }
      key = key.charAt(0).toLowerCase()+key.substring(1);
      hourly_weatherData = [];
      var arr = [];
      for(var element of dataObj.data){
        arr = [new Date(element["time"]*1000).getHours(),element[key]];
        hourly_weatherData[hourly_weatherData.length] = arr;
      }
      hourly_weatherData.sort(sortFunction);
      //console.log(hourly_weatherData);
      var y = [];
      for(var i=0;i<24;i++){
        y[y.length] = hourly_weatherData[i][1];
      }

      myChart.data.datasets[0].data=y;
      myChart.data.datasets[0].label = key;
      myChart.options.scales.yAxes[0].scaleLabel.labelString = chartLabels[key];
      myChart.update();

  }

  $scope.weeklyWeather = function(data,lat,long){

    var timeStamp = [];
    var lowTime = [];
    var highTime = [];
    var counter = 1;

    var mapping = {};
    var mainDoc = document.getElementById("modalBody");
    var mainHead = document.getElementById("modalTitle");
    var mainFoot = document.getElementById("modalFooter");

    var chart2 = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Weekly Weather"
      },
      axisX: {
        title: "Days"
      },
      axisY: {
        title: "Temperature in Fahrenheit",
        interval: 10,
        gridThickness: 0
      },
      legend :{
        verticalAlign: "top"
      },
      data: [{
        type: "rangeBar",
        color: "#9AD1F1",
        showInLegend: true,
        legendText : "Daywise Temperature Range",
    		yValueFormatString: "#0.#",
    		indexLabel: "{y[#index]}",
    		toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
        dataPoints: []
      }]
    });

    for(var element of data){
      var date = new Date(element["time"]*1000);
      var presentTime = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
      mapping[presentTime] = element["time"];
      timeStamp[timeStamp.length] = presentTime;
      lowTime[lowTime.length] = element["temperatureLow"];
      highTime[highTime.length] = element["temperatureHigh"];
      //console.log({x:10*counter,y:[element["temperatureLow"],element["temperatureHigh"]],label:presentTime});
      chart2.options.data[0].dataPoints.push({x:10*counter,y:[element["temperatureLow"],element["temperatureHigh"]],label:presentTime});
      chart2.options.data[0].click=function(e){
      mainDoc.innerHTML = "";
      mainHead.innerHTML = "";
      mainFoot.innerHTML = "";
//alert( e.dataSeries.type+ ", dataPoint { x:" + e.dataPoint.x + ", y: "+ e.dataPoint.y + " }" );
    //alert(mapping[e.dataPoint.label]);
    var url = "https://newproject-1573689447678.appspot.com/WeatherModal?time="+mapping[e.dataPoint.label]+"&lat="+lat+"&long="+long;
    //var url =  "https://newproject-1573689447678.appspot.com /WeatherModal?time="+time+"&lat="+lat+"&long="+long;
    $http.get(url).then(function(data){
      var time = mapping[e.dataPoint.label];
      date = new Date(time*1000);
      presentTime = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
      var temperature =  data["data"]["currently"]["temperature"];
      var summary =  data["data"]["currently"]["summary"];
      var icon =  data["data"]["currently"]["icon"];
      icon = "<img style=\"height:50%;width:25%;position:absolute; top:20%;left:70%\" src="+cloud_Icons[icon]+"></span>"
      var precipitation =  data["data"]["currently"]["precipIntensity"];
      var chanceOfRain =  (data["data"]["currently"]["precipProbability"]*100);
      var windSpeed =  data["data"]["currently"]["windSpeed"];
      var humidity =  data["data"]["currently"]["humidity"];
      var visibility =  data["data"]["currently"]["visibility"];

      var dateEntry = "<span style=\"font-size:220%;\">"+presentTime+"</span>";
      var cityEntry = "<div style=\"font-size:220%;\">"+mainCity+"</div>";
      summary = "<div style=\"font-size:120%;\">"+summary+"</div>";
      temperature = "<div id = \"infoTemperature\" style=\"font-size:320%;\">"+temperature+"<img src = \"https://cdn3.iconfinder.com/data/icons/virtual-notebook/16/button_shape_oval-512.png\" style=\" height:2%; width:2%;position:relative;top:-0.5em\"></img><span style=\"\">F</span></div>"
      precipitation = "<span style=\"margin-bottom:1em;font-size:120%; display:inline-block;\">Precipitation:"+"<span style=\"\">"+precipitation+"</span>"+"</span><br>";
      chanceOfRain = "<span style=\"margin-bottom:1em;font-size:120%; display:inline-block; \">Chance of Rain:"+"<span style=\"\">"+chanceOfRain+"<span style=\"\">%</span>"+"</span>"+"</span><br>";
      windSpeed = "<span style=\"margin-bottom:1em;font-size:120%; display:inline-block; \">Wind Speed:"+"<span style=\"\">"+windSpeed+"<span style=\"\">mph</span>"+"</span>"+"</span><br>";
      humidity = "<span style=\"margin-bottom:1em;font-size:120%; display:inline-block; \">Humidity:"+"<span style=\"\">"+humidity+"<span style=\"\">%"+"</span>"+"</span></span><br>";
      visibility = "<span style=\"margin-bottom:1em;font-size:120%; display:inline-block; \">Visibility:"+"<span style=\"\">"+visibility+"<span style=\"\">mi</span>"+"</span>"+"</span><br>";
    //  sunTime = "<span style=\"margin-bottom:10px;display:inline-block;\"><b>Sunrise/Sunset:</b>"+"<span style=\"font-size:1.25em;\"><b>"+sunrise+"<span style=\"font-size:0.75em;\">AM</span>"+"/"+sunset+"<span style=\"font-size:0.75em;\">PM</span>"+"</b></span>"+"</span><br>";


      console.log(time+" "+temperature+" "+summary+" "+icon+" "+precipitation);
      //console.log(mainDoc);

      mainHead.innerHTML += dateEntry;
      //mainDoc.innerHTML +=dateEntry;
      mainDoc.innerHTML +=cityEntry;
      mainDoc.innerHTML +=temperature;
      mainDoc.innerHTML +=icon;
      mainDoc.innerHTML +=summary;
      mainFoot.innerHTML +=precipitation;
      mainFoot.innerHTML +=chanceOfRain;
      mainFoot.innerHTML +=windSpeed;
      mainFoot.innerHTML +=humidity;
      mainFoot.innerHTML +=visibility;

      //document.getElementById('mymodal').showModal();
      $("#mymodal").modal();
      //console.log(data);
    });
}
      counter++;
      //chart2.render();
    }


    setTimeout (function(){
      chart2.render();
    },200);

  }

  $scope.getKey = function(){
    var e = document.getElementById("sel2");
    key = e.options[e.selectedIndex].value;
    //console.log(key);
    $scope.getChartData();
    //$scope.weatherSearch();
  }


  $scope.weatherData = function(lat,long) {
    console.log(lat+" "+long);
    //document.getElementById('searchResult').style.display="block";
    var url = "https://newproject-1573689447678.appspot.com/WeatherData?latitude="+lat+"&longitude="+long;
    $http.get(url).then(function(jsonData){
    console.log(jsonData);
    $scope.currentWeather(jsonData['data']['currently'],jsonData['data']['timezone']);
    $scope.hourlyWeather(jsonData['data']['hourly']['data']);
    $scope.weeklyWeather(jsonData['data']['daily']['data'],lat,long);
    //return jsonData['data']['hourly']['data'];
    });
  }

  $scope.localSearch = function(){
    //console.log("came here");
    var url = "http://ip-api.com/json";
    var mainData = [];

    mainData = $http.get(url).then(function(data){
      if(data){
      data = data['data'];
      searchResult = data;
      return data;
    }
    else{
      document.getElementById("invalidAddressAlert").style.display = "block";
      return null;
    }
    }, function(error){
      document.getElementById("invalidAddressAlert").style.display = "block";
      return null;
    }
  ).catch(function(error){
    document.getElementById("invalidAddressAlert").style.display = "block";
    return null;
  });

    return mainData;
  }


 $scope.states = [
 {
 "Abbreviation":"AL",
 "State":"Alabama"
 },
 {
 "Abbreviation":"AK",
 "State":"Alaska"
 },
 {
 "Abbreviation":"AZ",
 "State":"Arizona"
 },
 {
 "Abbreviation":"AR",
 "State":"Arkansas"
 },
 {
 "Abbreviation":"CA",
 "State":"California"
 },
 {
 "Abbreviation":"CO",
 "State":"Colorado"
 },
 {
 "Abbreviation":"CT",
 "State":"Connecticut"
 },
 {
 "Abbreviation":"DE",
 "State":"Delaware"
 },
 {
 "Abbreviation":"DC",
 "State":"District Of Columbia"
 },
 {
 "Abbreviation":"FL",
 "State":"Florida"
 },
 {
 "Abbreviation":"GA",
 "State":"Georgia"
 },
 {
 "Abbreviation":"HI",
 "State":"Hawaii"
 },
 {
 "Abbreviation":"ID",
 "State":"Idaho"
 },
 {
 "Abbreviation":"IL",
 "State":"Illinois"
 },
 {
 "Abbreviation":"IN",
 "State":"Indiana"
 },
 {
 "Abbreviation":"IA",
 "State":"Iowa"
 },
 {
 "Abbreviation":"KS",
 "State":"Kansas"
 },
 {
 "Abbreviation":"KY",
 "State":"Kentucky"
 },
 {
 "Abbreviation":"LA",
 "State":"Louisiana"
 },
 {
 "Abbreviation":"ME",
 "State":"Maine"
 },
 {
 "Abbreviation":"MD",
 "State":"Maryland"
 },
 {
 "Abbreviation":"MA",
 "State":"Massachusetts"
 },
 {
 "Abbreviation":"MI",
 "State":"Michigan"
 },
 {
 "Abbreviation":"MN",
 "State":"Minnesota"
 },
 {
 "Abbreviation":"MS",
 "State":"Mississippi"
 },
 {
 "Abbreviation":"MO",
 "State":"Missouri"
 },
 {
 "Abbreviation":"MT",
 "State":"Montana"
 },
 {
 "Abbreviation":"NE",
 "State":"Nebraska"
 },
 {
 "Abbreviation":"NV",
 "State":"Nevada"
 },
 {
 "Abbreviation":"NH",
 "State":"New Hampshire"
 },
 {
 "Abbreviation":"NJ",
 "State":"New Jersey"
 },
 {
 "Abbreviation":"NM",
 "State":"New Mexico"
 },
 {
 "Abbreviation":"NY",
 "State":"New York"
 },
 {
 "Abbreviation":"NC",
 "State":"North Carolina"
 },
 {
 "Abbreviation":"ND",
 "State":"North Dakota"
 },
 {
 "Abbreviation":"OH",
 "State":"Ohio"
 },
 {
 "Abbreviation":"OK",
 "State":"Oklahoma"
 },
 {
 "Abbreviation":"OR",
 "State":"Oregon"
 },
 {
 "Abbreviation":"PA",
 "State":"Pennsylvania"
 },
 {
 "Abbreviation":"RI",
 "State":"Rhode Island"
 },
 {
 "Abbreviation":"SC",
 "State":"South Carolina"
 },
 {
 "Abbreviation":"SD",
 "State":"South Dakota"
 },
 {
 "Abbreviation":"TN",
 "State":"Tennessee"
 },
 {
 "Abbreviation":"TX",
 "State":"Texas"
 },
 {
 "Abbreviation":"UT",
 "State":"Utah"
 },
 {
 "Abbreviation":"VT",
 "State":"Vermont"
 },
 {
 "Abbreviation":"VA",
 "State":"Virginia"
 },
 {
 "Abbreviation":"WA",
 "State":"Washington"
 },
 {
 "Abbreviation":"WV",
 "State":"West Virginia"
 },
 {
 "Abbreviation":"WI",
 "State":"Wisconsin"
 },
 {
 "Abbreviation":"WY",
 "State":"Wyoming"
 }
 ];
}]);
