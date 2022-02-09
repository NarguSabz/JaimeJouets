/**
* import all modules
**/

var express = require('express');
var http = require('http');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

/*
* parse all form data
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
* view engine template parsing (ejs types)
*/

app.set('view engine', 'ejs');

/**
* import all related Javascript and css files to inject in our app
*/
app.use(express.static(__dirname + '/public/'));
var serveur = app.listen(2000, function(){
	console.log("serveur fonctionne sur 2000... ! ");
});