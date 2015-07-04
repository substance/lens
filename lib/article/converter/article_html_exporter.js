var Substance = require('substance');
var _ = Substance._;

var HtmlExporter = Substance.Document.HtmlExporter;
var schema = require('../article_schema');

function ArticleHtmlExporter() {
  ArticleHtmlExporter.super.call(this, { schema: schema });
}

ArticleHtmlExporter.Prototype = function() {

  this.convert = function(doc, options) {
    this.initialize(doc, options);

    var $doc = this.createHtmlDocument();

    var $head = $doc.find('head')
    $head.append($('<!-- title is only there to calm down the validator. do not edit -->'))
      .append($('<title>🐰</title>'))
      .append($('<meta charset="utf-8" />'));

    var $body = $doc.find('body');
    $body.append(this.header());
    $body.append(this.main());

    // $doc.html() can not be called, so we just render the html element
    return ['<!DOCTYPE html>', '<html lang="en">', $doc.find('html').html(), '</html>'].join('');
  };

  this.header = function() {
    var doc = this.state.doc;

    var $header = $('<header>');

    var articleMeta = doc.get('article-meta');
    $header.append(articleMeta.toHtml(this));

    var figures = doc.getIndex('type').get('image_figure');
    _.each(figures, function(figure) {
      $header.append(figure.toHtml(this));
    }, this);

    var tables = doc.getIndex('type').get('table_figure');
    _.each(tables, function(table) {
      $header.append(table.toHtml(this));
    }, this);

    var bibItems = doc.getIndex('type').get('bib_item');
    _.each(bibItems, function(bibItem) {
      $header.append(bibItem.toHtml(this));
    }, this);

    return $header;
  };

  this.main = function() {
    var doc = this.state.doc;
    var main = doc.get('main');
    var $main = $('<main>').append(this.convertContainer(main));
    return $main;
  };

};

Substance.inherit(ArticleHtmlExporter, HtmlExporter);

module.exports = ArticleHtmlExporter;
