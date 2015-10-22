var Substance = require('substance');
var HtmlImporter = Substance.Document.HtmlImporter;
var schema = require('./articleSchema');

function ArticleHtmlImporter() {
  ArticleHtmlImporter.super.call(this, { schema: schema });
}

ArticleHtmlImporter.Prototype = function() {

  this.convert = function($rootEl, doc) {
    this.initialize(doc, $rootEl);

    var $meta = $rootEl.find('meta');
    if (!$meta.length) {
      throw new Error('meta is mandatory');
    }

    var $resources = $rootEl.find('resources');
    if (!$resources.length) {
      throw new Error('resources is mandatory');
    }
    var $body = $rootEl.find('body');
    if (!$body.length) {
      throw new Error('body is mandatory');
    }

    this.meta($meta);
    this.resources($resources);
    this.body($body);
    this.finish();
  };

  this.meta = function($meta) {
    this.convertElement($meta);
  };

  this.resources = function($resources) {
    var self = this;
    var doc = this.state.doc;

    $resources.children().each(function() {
      var $child = self.$(this);
      self.convertElement($child);
    });
  };

  this.body = function($body) {
    this.convertContainer($body, 'main');
  };

};

Substance.inherit(ArticleHtmlImporter, HtmlImporter);

module.exports = ArticleHtmlImporter;