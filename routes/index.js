var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var isVal = require('valid-url');

var router = express.Router();

var url;

/* GET home page. */
router.get('/', function(req, res, next) {
  url = req.query['url'];
  var err;
  if(url){
    var rg_protocol = new RegExp("(http|https):\\/\\/");
    if(!(rg_protocol.test(url))){
      url = "http://"+url;
      console.log(url);
    }
    if(isVal.isUri(url)) {
      console.log("Получен Url: " + url);
      request(url, {timeout: 2000}, function (error, response, body) {
        if (!error) {
          console.log(response.statusCode);
          if (200 <= response.statusCode && response.statusCode < 300) {
            res.render('index', {status: "Success", body_of_page: body});
            console.log(response.headers.location);
          } else {
            if (300 <= response.statusCode && response.statusCode < 400) {
              res.render('index', {status: "Redirect", body_of_page: response.headers.location});
            } else {
              res.render('index', {status: response.statusCode + " " + response.statusMessage, body_of_page: null});
            }
          }
        } else {
          res.render('index', {status: error.message, body_of_page: null});
          console.log("Произошла ошибка: " + error.message);
        }
      });
    }else{
      err = new Error('Invalid Uri "'+ url +'"');
      err.status = 400;
      throw err;
    }
  }else{
    err = new Error('Bad Request');
    err.status = 400;
    throw err;
  }
  next();
});

module.exports = router;
