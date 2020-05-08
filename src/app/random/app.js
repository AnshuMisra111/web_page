const request = require('request');
var axios = require('axios');
var express = require('express');
var cors = require('cors');
var https = require('https');
var app = express();
var server = https.createServer(app);


app.use(cors());
app.use('/',express.static('./public'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE ');
    res.header("Access-Control-Allow-Headers",'X-Requested-With,Content-Type')
    next();
});


app.get('/WeatherData',function(req,res){
    //console.log("came here");
    var lat = req.query.latitude;
    var long = req.query.longitude;
    var url = "https://api.darksky.net/forecast/ddfa098bf87455a227e584111ddc172d/"+lat+","+long;
    axios.get(url).then(function(response){
       // console.log("response")
    var result=response.data;
    console.log(result);
    res.send(result);
  }).catch(function(error){
    return res.status(400).send({
   message: 'This is an error!'
});
  });
  });

  app.get('/StateSeal',function(req,res){

      var state = req.query.state;
      console.log("came here and state ="+state);
    //  var searchId = req.query.search_id;
    //  var key = req.api_key;
      var url = "https://www.googleapis.com/customsearch/v1?q="+state+"%20State%20Seal&cx=009738033209928298540:fg6619stlg0&imgSize=huge&imgType=news&num=1&searchType=image&key=AIzaSyAt5hDCocOEcxDwWe3fZYsm1ovC556oU34";
      //var url = "https://api.darksky.net/forecast/ddfa098bf87455a227e584111ddc172d/"+lat+","+long;
      axios.get(url).then(function(response){
         // console.log("response")
      var result=response.data;
      //console.log(result);
      res.send(result);
    }).catch(function(error){
      console.log(error);
    });
    });


    app.get('/WeatherModal',function(req,res){

        var time = req.query.time;
        var lat = req.query.lat;
        var long = req.query.long;

        console.log("came here and state ="+time+" "+lat+" "+long);
      //  var searchId = req.query.search_id;
      //  var key = req.api_key;
      var url = "https://api.darksky.net/forecast/ddfa098bf87455a227e584111ddc172d/"+lat+","+long+","+time;
        //var url = "https://www.googleapis.com/customsearch/v1?q="+state+"%20State%20Seal&cx=009738033209928298540:fg6619stlg0&imgSize=huge&imgType=news&num=1&searchType=image&key=AIzaSyAt5hDCocOEcxDwWe3fZYsm1ovC556oU34";
        //var url = "https://api.darksky.net/forecast/ddfa098bf87455a227e584111ddc172d/"+lat+","+long;
        axios.get(url).then(function(response){
           // console.log("response")
        var result=response.data;
        //console.log(result);
        res.send(result);

      }).catch(function(error){
        console.log(error);
      });


      });

app.get('/Autocomplete',function(req,res){
    //console.log("came here");
    var keyword = req.query.keyword;
    var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+keyword+"&types=(cities)&language=en&key=AIzaSyBy2MEexehHdEUnjPn5ViNLvv5YwKzFyBI";
    axios.get(url).then(function(response){
       // console.log("response")
    var result=response.data;
    //console.log(result);
    res.send(result);
    });
  });

  app.listen(3000);
  module.exports=app;
  console.log("running..");
