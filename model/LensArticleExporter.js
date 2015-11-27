'use strict';

var XMLExporter = require('substance/model/XMLExporter');
var converters = require('./LensArticleImporter').converters;
var each = require('lodash/collection/each');

function LensArticleExporter() {
  LensArticleExporter.super.call(this, {
    converters: converters,
    containerId: 'main'
  });
}

LensArticleExporter.Prototype = function() {
  this.exportDocument = function(doc) {
    this.state.doc = doc;
    var $$ = this.$$;
    var articleEl = $$('article');

    // Export ArticleMeta
    var metaEl = this.convertNode(doc.get('article-meta'));
    console.log('metaEl', metaEl);
    articleEl.append(metaEl);

    // Export resources (e.g. bib items)
    var resourceEl = $$('resources');
    var bibItems = doc.getIndex('type').get('bib-item');
    each(bibItems, function(bibItem) {
      var bibItemEl = this.convertNode(bibItem);
      resourceEl.append(bibItemEl);
    }, this);
    articleEl.append(resourceEl);

    // Export article body
    var bodyElements = this.convertContainer(doc, this.state.containerId);
    articleEl.append(
      $$('body').append(bodyElements)
    );

    return articleEl.outerHTML;
  };

};

XMLExporter.extend(LensArticleExporter);

module.exports = LensArticleExporter;