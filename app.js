var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var axios = require('axios');
var apiKey = '8fa3faaca81db7053ff54ae80ef7ef2f';
const baseURL = 'https://developers.zomato.com/api/v2.1/';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/',function(req,res){
    res.render('index',{
        title : 'Tomato',
    });
    console.log('user accessing Home page');
});

app.get('/city-coordinate',function(req,res){
  console.log(req.query)
    axios({
      method: 'get',
      url: baseURL + 'cities?lat=' + req.query.lat + '&lon=' + req.query.lon,
      headers: {'user-key': apiKey}
    })
    .then(function (response) {
      if (response.data.location_suggestions[0] == null) {
        res.render('city', {
          displayNone: true,
          restaurants: [],
          arrOne: 0,
          arrTwo: 0,
          arrThree: 0,
          arrFour: 0,
          arrFive: 0,
          rateOne: 0,
          rateTwo: 0,
          rateThree: 0,
          rateFour: 0,
          rateFive: 0
        });
      } else {
        axios({
          method: 'get',
          url: baseURL + 'search?entity_id=' + response.data.location_suggestions[0].id + '&entity_type=city',
          headers: {'user-key': apiKey}
        })
        .then(function (response) {
          var restaurants = response.data.restaurants;
          var arrFive = response.data.restaurants.filter(item => Number(item.restaurant.user_rating.aggregate_rating) == 5)
          var arrFour = response.data.restaurants.filter(item => Number(item.restaurant.user_rating.aggregate_rating) >= 4 && Number(item.restaurant.user_rating.aggregate_rating) < 5)
          var arrThree = response.data.restaurants.filter(item => Number(item.restaurant.user_rating.aggregate_rating) >= 3 && Number(item.restaurant.user_rating.aggregate_rating) < 4)
          var arrTwo = response.data.restaurants.filter(item => Number(item.restaurant.user_rating.aggregate_rating) >= 2 && Number(item.restaurant.user_rating.aggregate_rating) < 3)
          var arrOne = response.data.restaurants.filter(item => Number(item.restaurant.user_rating.aggregate_rating) >= 1 && Number(item.restaurant.user_rating.aggregate_rating) < 2)
          console.log(arrFive.length, arrFour.length, arrThree.length, arrTwo.length, arrOne.length)
          console.log(arrOne.length/restaurants.length*100, arrTwo.length/restaurants.length*100, arrThree.length/restaurants.length*100, arrFour.length/restaurants.length*100, arrFive.length/restaurants.length*100)
          res.render('city', {
            displayNone: false,
            restaurants: response.data.restaurants,
            arrOne: arrOne.length == 0 ? 1 : arrOne.length/restaurants.length*100 + 1,
            arrTwo: arrTwo.length == 0 ? 1 : arrTwo.length/restaurants.length*100 + 1,
            arrThree: arrThree.length == 0 ? 1 : arrThree.length/restaurants.length*100 + 1,
            arrFour: arrFour.length == 0 ? 1 : arrFour.length/restaurants.length*100 + 1,
            arrFive: arrFive.length == 0 ? 1 : arrFive.length/restaurants.length*100 + 1,
            rateOne: arrOne.length,
            rateTwo: arrTwo.length,
            rateThree: arrThree.length,
            rateFour: arrFour.length,
            rateFive: arrFive.length,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post('/city',function(req,res){
    console.log(req.body.city)
    axios({
      method: 'get',
      url: baseURL + 'cities?q=' + req.body.city + '&start=' + 0,
      headers: {'user-key': apiKey}
    })
    .then(function (response) {
      if (response.data.location_suggestions[0] == null) {
        res.render('city', {
          displayNone: true,
          restaurants: [],
          arrOne: 0,
          arrTwo: 0,
          arrThree: 0,
          arrFour: 0,
          arrFive: 0,
          rateOne: 0,
          rateTwo: 0,
          rateThree: 0,
          rateFour: 0,
          rateFive: 0
        });
      } else {
        axios({
          method: 'get',
          url: baseURL + 'search?entity_id=' + response.data.location_suggestions[0].id + '&entity_type=city',
          headers: {'user-key': apiKey}
        })
        .then(function (response) {
          var restaurants = response.data.restaurants;
          var arrFive = response.data.restaurants.filter(item => Number(item.restaurant.user_rating.aggregate_rating) == 5)
          var arrFour = response.data.restaurants.filter(item => Number(item.restaurant.user_rating.aggregate_rating) >= 4 && Number(item.restaurant.user_rating.aggregate_rating) < 5)
          var arrThree = response.data.restaurants.filter(item => Number(item.restaurant.user_rating.aggregate_rating) >= 3 && Number(item.restaurant.user_rating.aggregate_rating) < 4)
          var arrTwo = response.data.restaurants.filter(item => Number(item.restaurant.user_rating.aggregate_rating) >= 2 && Number(item.restaurant.user_rating.aggregate_rating) < 3)
          var arrOne = response.data.restaurants.filter(item => Number(item.restaurant.user_rating.aggregate_rating) >= 1 && Number(item.restaurant.user_rating.aggregate_rating) < 2)

          console.log(arrFive.length, arrFour.length, arrThree.length, arrTwo.length, arrOne.length);
          console.log(arrOne.length/restaurants.length*100, arrTwo.length/restaurants.length*100, arrThree.length/restaurants.length*100, arrFour.length/restaurants.length*100, arrFive.length/restaurants.length*100)
          res.render('city', {
            displayNone: false,
            restaurants: response.data.restaurants,
            arrOne: arrOne.length == 0 ? 1 : (arrOne.length/restaurants.length*100 == 100 ? 100 : arrOne.length/restaurants.length*100 + 1),
            arrTwo: arrTwo.length == 0 ? 1 : (arrTwo.length/restaurants.length*100 == 100 ? 100 : arrTwo.length/restaurants.length*100 + 1),
            arrThree: arrThree.length == 0 ? 1 : (arrThree.length/restaurants.length*100 == 100 ? 100 : arrThree.length/restaurants.length*100 + 1),
            arrFour: arrFour.length == 0 ? 1 : (arrFour.length/restaurants.length*100 == 100 ? 100 : arrFour.length/restaurants.length*100 + 1),
            arrFive: arrFive.length == 0 ? 1 : (arrFive.length/restaurants.length*100 == 100 ? 100 : arrFive.length/restaurants.length*100 + 1),
            rateOne: arrOne.length,
            rateTwo: arrTwo.length,
            rateThree: arrThree.length,
            rateFour: arrFour.length,
            rateFive: arrFive.length,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
