var Substance = require('substance');

var HtmlImporter = Substance.Document.HtmlImporter;
var schema = require('../article_schema');

function ArticleHtmlImporter() {
  ArticleHtmlImporter.super.call(this, { schema: schema });
}

ArticleHtmlImporter.Prototype = function() {

  this.convert = function($rootEl, doc) {
    this.initialize(doc, $rootEl);

    var $body = $rootEl.find('body');
    if(!$body.length) {
      throw new Error('body is mandatory');
    }
    var $header = $body.children('header');
    if (!$header.length) {
      throw new Error('body/header is mandatory');
    }
    var $main = $body.children('main');
    if (!$main.length) {
      throw new Error('body/main is mandatory');
    }

    this.header($header);
    this.main($main);

    this.finish();
  };

  this.header = function($header) {
    var self = this;
    var doc = this.state.doc;
    $header.children().each(function() {
      var $child = self.$(this);
      self.convertElement($child);
    });
    // TODO: should we do some QA here?
    var meta = doc.get('article-meta');
    if (!meta) {
      console.error('Article should have `body/header/[typeof=meta]`.');
    }
  };

  this.main = function($main) {
    this.convertContainer($main, 'main');
  };

};

Substance.inherit(ArticleHtmlImporter, HtmlImporter);

module.exports = ArticleHtmlImporter;