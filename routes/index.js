var express = require('express');
var router = express.Router();
var axios = require('axios');
var apiKey = '8fa3faaca81db7053ff54ae80ef7ef2f';
const baseURL = 'https://developers.zomato.com/api/v2.1/';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tomato' });
});

module.exports = router;
