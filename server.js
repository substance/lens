var express = require('express');
var path = require('path');
var server = require('substance/util/server');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 5000;

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.json({limit: '3mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

// use static server
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "app/assets")));
app.use(express.static(path.join(__dirname, "app/data")));
app.use('/i18n', express.static(path.join(__dirname, "app/i18n")));
app.use('/fonts', express.static(path.join(__dirname, 'node_modules/font-awesome/fonts')));

server.serveStyles(app, '/app.css', path.join(__dirname, 'app', 'app.scss'));
server.serveJS(app, '/app.js', path.join(__dirname, 'app', 'app.js'));

app.listen(port, function(){
  console.log("Lens running on port " + port);
  console.log("http://127.0.0.1:"+port+"/");
});

// Export app for requiring in test files
module.exports = app;