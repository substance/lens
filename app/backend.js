// var LensArticle = require('../model/LensArticle');
var oo = require('substance/util/oo');
var $ = require('substance/util/jquery');
var each = require('lodash/collection/each');
var LensArticleImporter = require('../model/LensArticleImporter');

var LensArticleExporter = require('../model/LensArticleExporter');
var exporter = new LensArticleExporter();

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
      dataType: "text",
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

    $.ajax(ajaxOpts);
  };

  // Document
  // ------------------

  this.getDocument = function(documentId, cb) {
    this._request('GET', 'data/example-doc.xml', null, function(err, xml) {
      if (err) { console.error(err); cb(err); }
      
      // Start importer
      var importer = new LensArticleImporter();
      var doc = importer.importDocument(xml);
      window.doc = doc;

      // updateBibItemIds(doc);

      // // Export doc
      // var newXML = exporter.exportDocument(doc);
      // console.log('LE XML', newXML);

      // Initial update of collections
      doc.updateCollections();
      cb(null, doc);
    });
  };

  this.saveDocument = function(doc, cb) {
    cb('Not supported in dev version');
  };

  // Figure related
  // ------------------

  this.uploadFigure = function(file, cb) {
    // This is a fake implementation
    var objectURL = window.URL.createObjectURL(file);
    cb(null, objectURL);
  };
};

oo.initClass(Backend);

module.exports = Backend;