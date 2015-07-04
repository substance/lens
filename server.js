var http = require('http');
var express = require('express');
var path = require('path');
var Substance = require("substance");
var fs = require('fs');
var sass = require('node-sass');
var bodyParser = require('body-parser');
var _ = require('lodash');

var app = express();
var port = process.env.PORT || 5000;

var browserify = require("browserify");
var babelify = require("babelify");
var es6ify = require("es6ify");

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.json({limit: '3mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

// use static server
app.use(express.static(path.join(__dirname, "app/assets")));
app.use(express.static(path.join(__dirname, "app/data")));
app.use('/i18n', express.static(path.join(__dirname, "app/i18n")));


// Backend
// --------------------

app.get('/app.js', function (req, res, next) {
  // var startTime = Date.now();
  browserify({ debug: true, cache: false })
    // .transform(es6ify)
    // .transform(es6ify.configure(new RegExp('^'+path.join(__dirname, 'src')+'.+$')))
    // .transform(babelify.configure({ only: [ path.join(__dirname, 'src') ] }))
    .add(path.join(__dirname, "app", "app.js"))
    // .on('file', function(file, id, parent) {
    //   console.log('### ', (Date.now() - startTime));
    // })
    .bundle()
    .on('error', function(err, data){
      console.error(err.message);
      res.send('console.log("'+err.message+'");');
    })
    .pipe(res);
});

var handleError = function(err, res) {
  console.error(err);
  res.status(400).json(err);
};

var renderSass = function(cb) {
  sass.render({
    file: path.join(__dirname, "app", "app.scss"),
    sourceMap: true,
    outFile: 'app.css',
  }, cb);
};

// use static server
app.use(express.static(__dirname));

app.get('/app.css', function(req, res) {
  renderSass(function(err, result) {
    if (err) return handleError(err, res);
    res.set('Content-Type', 'text/css');
    res.send(result.css);
  });
});

app.get('/app.css.map', function(req, res) {
  renderSass(function(err, result) {
    if (err) return handleError(err, res);
    res.set('Content-Type', 'text/css');
    res.send(result.map);
  });
});




app.listen(port, function(){
  console.log("Lens running on port " + port);
  console.log("http://127.0.0.1:"+port+"/");
});

// Export app for requiring in test files
module.exports = app;