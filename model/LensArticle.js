var schema = require('./articleSchema');
var _ = require('substance/util/helpers');
var oo = require('substance/util/oo');
var $ = require('substance/util/jquery');
var Document = require('substance/model/Document');
var NodeIndex = require('substance/model/data/NodeIndex');

var ArticleHtmlImporter = require('./ArticleHtmlImporter');
var ArticleHtmlExporter = require('./ArticleHtmlExporter');
var ArticleXmlExporter = require('./ArticleXmlExporter');

var CiteprocCompiler = require('../packages/bibliography/CiteprocCompiler');
var Bibliography = require('../packages/bibliography/Bibliography');
var Collection = require('./Collection');

var Article = function() {
  // HACK: at the moment we need to seed this way
  // as containers get registered on construction
  // it would be better if we created the containers dynamically
  Article.super.call(this, schema);
};

Article.Prototype = function() {

  this.initialize = function() {
    this.super.initialize.apply(this, arguments);

    this.create({
      type: "container",
      id: "main",
      nodes: []
    });

    this.citeprocCompiler = new CiteprocCompiler();

    this.collections = {
      "bib-item": new Bibliography(this, 'main'),
      "image-figure": new Collection(this, 'main', 'image-figure', 'Figure'),
      "table-figure": new Collection(this, 'main', 'table-figure', 'Table'),
    };

    this.includesIndex = this.addIndex('includes', NodeIndex.create({
      type: "include",
      property: "nodeId"
    }));

    // Needed in AddBibItemComponent so we can map guid (aka DOI's) withour internal substance ids
    this.bibItemByGuidIndex = this.addIndex('bibItemByGuid', NodeIndex.create({
      type: "bib-item",
      property: "guid"
    }));

    this.citationsIndex = this.addIndex('citations', NodeIndex.create({
      type: "citation",
      property: "targets"
    }));
  };

  this.documentDidLoad = function() {
    Article.super.prototype.documentDidLoad.call(this);
    if (!this.isClipboard()) {
      _.each(this.collections, function(c) {
        c.update();
      });
    }
  };

  this.toXml = function() {
    return new ArticleXmlExporter().convert(this);
  };

  this.toHtml = function() {
    return new ArticleHtmlExporter().convert(this);
  };

  this.propertyToHtml = function(path) {
    return new ArticleHtmlExporter().convertProperty(this, path);
  };

  this.getDocumentMeta = function() {
    return this.get('article-meta');
  };

  // TODO: refactor this. Use a static Node property to declare
  // which nodes should go into the toc
  this.getTOCNodes = function() {
    var tocNodes = [];
    var contentNodes = this.get('main').nodes;
    _.each(contentNodes, function(nodeId) {
      var node = this.get(nodeId);
      if (node.type === "heading") {
        tocNodes.push(node);
      }
    }, this);
    return tocNodes;
  };

  this.getCiteprocCompiler = function() {
    return this.citeprocCompiler;
  };

  this.getBibliography = function() {
    return this.collections["bib-item"];
  };

  // Legacy delete
  this.getFiguresCollection = function() {
    return this.collections["image-figure"];
  };

  this.getTablesCollection = function() {
    return this.collections["table-figure"];
  };

  this.getCollection = function(itemType) {
    return this.collections[itemType];
  };

  // Document title
  this.getTitle = function() {
    return this.get('article-meta').title;
  };

  // Document manipulation
  // -------------------

  // TODO: delete all figure references
  //
  this.deleteFigure = function(figureId) {
    this.transaction(function(tx, args) {
      var figureCitations = _.map(this.citationsIndex.get(figureId));
      // Delete references
      _.each(figureCitations, function(citation) {
        // TODO: inspect figRef.figures if there is more than one entry
        // If so only remove that entry for the reference
        tx.delete(citation.id);
      });
      var figIncludes = _.map(tx.getIndex('includes').get(figureId));
      // Remove figure includes from container first
      _.each(figIncludes, function(figInc) {
        tx.get('main').hide(figInc.id);
        tx.delete(figInc.id);
      });
      tx.delete(figureId);
      return args;
    });
  };

  this.deleteBibItem = function(bibItemId) {
    this.transaction(function(tx, args) {
      var bibItemCitations = _.map(tx.getIndex('citations').get(bibItemId));
      // Delete references
      _.each(bibItemCitations, function(citation) {
        // TODO: inspect bibItemRef.bibItems if there is more than one entry
        // If so only remove that entry for the reference
        tx.delete(citation.id);
      });
      tx.delete(bibItemId);
      return args;
    });
  };
};

oo.inherit(Article, Document);

Article.XML_TEMPLATE = [
'<article xmlns="http://substance.io/science-article/0.1.0" lang="en">',
  '<meta>',
    '<title>Enter title</title>',
    '<abstract>Enter abstract</abstract>',
  '</meta>',
  '<resources></resources>',
  '<body>',
    '<p id="p1">Enter your article here.</p>',
  '</body>',
'</article>'
].join('');

// Article.fromHtml = function(html) {
//   var $root;
//   if (typeof window === "undefined") {
//     $root = $(html);
//   } else {
//     var parser = new window.DOMParser();
//     var htmlDoc = parser.parseFromString(html, "text/xml");
//     $root = $(htmlDoc);
//   }
//   var doc = new Article();
//   new ArticleHtmlImporter().convert($root, doc);
//   doc.documentDidLoad();
//   return doc;
// };

// Article.fromXml = function(xml) {
//   if (_.isString(xml)) {
//     var parser = new window.DOMParser();
//     xml = parser.parseFromString(xml,"text/xml");
//   }
//   var $root = $(xml);
//   var doc = new Article();
//   new ArticleHtmlImporter().convert($root, doc);
//   doc.documentDidLoad();
//   return doc;
// };

Article.ArticleHtmlImporter = ArticleHtmlImporter;

module.exports = Article;
