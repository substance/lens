var Substance = require("substance");
var Article = require('../lib/article');

var Backend = function() {
  
};

Backend.Prototype = function() {

  // A generic request method
  // -------------------
  //
  // Deals with sending the authentication header, encoding etc.

  this._request = function(method, url, data, cb) {
    var ajaxOpts = {
      type: method,
      url: url,
      contentType: "application/json; charset=UTF-8",
      // dataType: "json",
      success: function(data) {
        cb(null, data);
      },
      error: function(err) {
        console.error(err);
        cb(err.responseText);
      }
    };

    if (data) {
      ajaxOpts.data = JSON.stringify(data);
    }

    // Add Authorization header if there's an active session
    var session = localStorage.getItem('session');
    if (session) {
      var token = JSON.parse(session).token;

      ajaxOpts.beforeSend = function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      };
    }

    $.ajax(ajaxOpts);
  };


  // Document
  // ------------------

  this.getDocument = function(documentId, cb) {
    
    this._request('GET', 'data/full-doc.html', null, function(err, rawDoc) {
      if (err) { console.error(err); cb(err); }
      var doc = Article.fromHtml(rawDoc);
      window.doc = doc;
      cb(null, doc);

      // console.log('convert back to HTML', doc.toHtml());

    });
  };

  this.saveDocument = function(doc, cb) {
    cb('Not supported in dev version');
  };

  // Figure related
  // ------------------

  this.uploadFigure = function(file, cb) {
    // This is a fake implementation
    var objectURL = URL.createObjectURL(file);
    cb(null, objectURL);
  };
};

Substance.initClass(Backend);

module.exports = Backend;