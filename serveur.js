/**
* import all modules
**/

var express = require('express');
var http = require('http');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

var creationRouter = require('./routes/creation');
var connexionRouter = require('./routes/connexion');
var produitRouter = require('./routes/produit');
var produitsRouter = require('./routes/produits');
var indexRouter = require('./routes/index');
/*
* parse all form data
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
* view engine template parsing (ejs types)
*/

//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
* import all related Javascript and css files to inject in our app
*/
app.use(express.static(__dirname + '/public/'));

app.use('/login', connexionRouter);
app.use('/creerUnCompte', creationRouter);
app.use('/produits', produitsRouter);
app.use('/produit', produitRouter);
app.use('/creerUnCompte', creationRouter);
app.use('/', indexRouter);

//catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  next(createError(404));
//});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});

var serveur = app.listen(2000, function () {
    console.log("serveur fonctionne sur 2000... ! ");
});

module.exports = app;