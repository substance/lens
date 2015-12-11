var schema = require('./articleSchema');
var _ = require('substance/util/helpers');
var Document = require('substance/model/Document');
var DocumentIndex = require('substance/model/DocumentIndex');

var CiteprocCompiler = require('../packages/bibliography/CiteprocCompiler');
var Bibliography = require('../packages/bibliography/Bibliography');
var Collection = require('./Collection');

var without = require('lodash/array/without');

var LensArticle = function() {
  // HACK: at the moment we need to seed this way
  // as containers get registered on construction
  // it would be better if we created the containers dynamically
  LensArticle.super.call(this, schema);

  this.connect(this, {
    'document:changed': this.onDocumentChanged
  });
};

LensArticle.Prototype = function() {
  // HACK: We ensure referential integrity by just patching the targets property
  // of citation nodes until we have a better solution:
  // See: https://github.com/substance/substance/issues/295
  this.onDocumentChanged = function(change) {
    _.each(change.ops, function(op) {
      if (op.isDelete()) {
        var deletedNode = op.val;

        // Check if deleted node is a citeable node
        if (deletedNode.type === 'image-figure' || deletedNode.type === 'table-figure' || deletedNode.type === 'bib-item') {
          var citations = this.getIndex('citations').get(deletedNode.id);
          _.each(citations, function(citation) {
            citation.targets = without(citation.targets, deletedNode.id);
          });
        }
      }
    }.bind(this));
  };

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

    this.includesIndex = this.addIndex('includes', DocumentIndex.create({
      type: "include",
      property: "nodeId"
    }));

    this.citationsIndex = this.addIndex('citations', DocumentIndex.create({
      type: "citation",
      property: "targets"
    }));
  };

  this.updateCollections = function() {
    _.each(this.collections, function(c) {
      c.update();
    });
  };

  this.getDocumentMeta = function() {
    return this.get('article-meta');
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

Document.extend(LensArticle);

LensArticle.XML_TEMPLATE = [
'<article xmlns="http://substance.io/science-article/0.1.0" lang="en">',
  '<metadata>',
    '<title>Enter title</title>',
    '<abstract>Enter abstract</abstract>',
  '</metadata>',
  '<resources></resources>',
  '<body>',
    '<p id="p1">Enter your article here.</p>',
  '</body>',
'</article>'
].join('');

module.exports = LensArticle;