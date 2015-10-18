var Substance = require('substance');
var _ = Substance._;
var $ = require('substance/basics/jquery');

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

    var res = new window.XMLSerializer().serializeToString($doc[0]);
    window.res = res;

    // jQuery requires us to have xmlns on the root element set to xhml
    // however that's wrong, so we change it to our own namespace
    // See: http://stackoverflow.com/questions/8084175/how-do-i-prevent-jquery-from-inserting-the-xmlns-attribute-in-an-xml-object
    res = res.replace('http://www.w3.org/1999/xhtml', 'http://substance.io/science-article/0.1.0');
    
    // var res = ['<article xmlns="http://substance-io/science-article/0.1.0">', $article.html(), '</article>'].join('');
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
    var $body = $('<body>').append(bodyNodes);
    return $body;
  };

};

Substance.inherit(ArticleXmlExporter, HtmlExporter);

module.exports = ArticleXmlExporter;
