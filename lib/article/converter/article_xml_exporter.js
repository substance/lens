var Substance = require('substance');
var _ = Substance._;

var HtmlExporter = Substance.Document.HtmlExporter;
var schema = require('../article_schema');

function ArticleXmlExporter() {
  ArticleXmlExporter.super.call(this, { schema: schema });
}

ArticleXmlExporter.Prototype = function() {

  this.convert = function(doc, options) {
    this.initialize(doc, options);

    var $doc = this.createXmlDocument();
    var $article = $doc.find('article');
    
    $article.append(this.meta());
    $article.append(this.resources());
    $article.append(this.body());


    var res = new XMLSerializer().serializeToString($doc[0]);
    // var res = ['<article>', $article.html(), '</article>'].join('');
    console.log('res', res);
    return res;
  };

  this.meta = function() {
    var doc = this.state.doc;
    var articleMeta = doc.get('article-meta');
    return articleMeta.toHtml(this);
  };

  this.resources = function() {
    var doc = this.state.doc;
    var $resources = $('<resources>');

    var figures = doc.getIndex('type').get('image_figure');
    _.each(figures, function(figure) {
      $resources.append(figure.toHtml(this));
    }, this);

    var tables = doc.getIndex('type').get('table_figure');
    _.each(tables, function(table) {
      $resources.append(table.toHtml(this));
    }, this);

    var bibItems = doc.getIndex('type').get('bib_item');
    _.each(bibItems, function(bibItem) {
      $resources.append(bibItem.toHtml(this));
    }, this);

    return $resources;
  };

  this.body = function() {
    var doc = this.state.doc;
    var body = doc.get('main');
    var bodyNodes = this.convertContainer(body);
    var $body = $('<body>').append(this.convertContainer(body));
    return $body;
  };

};

Substance.inherit(ArticleXmlExporter, HtmlExporter);

module.exports = ArticleXmlExporter;
