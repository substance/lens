'use strict';

var oo = require('substance/util/oo');
var XMLImporter = require('substance/model/XMLImporter');
var articleSchema = require('./articleSchema');
var LensArticle = require('./LensArticle');

var converters = [
  require('substance/packages/paragraph/ParagraphHTMLConverter'),
  require('substance/packages/blockquote/BlockquoteHTMLConverter'),
  require('substance/packages/codeblock/CodeblockHTMLConverter'),
  require('substance/packages/heading/HeadingHTMLConverter'),
  require('substance/packages/image/ImageXMLConverter'),
  require('substance/packages/strong/StrongHTMLConverter'),
  require('substance/packages/emphasis/EmphasisHTMLConverter'),
  require('substance/packages/link/LinkHTMLConverter'),

  // Lens-specific converters
  require('../packages/metadata/MetadataXMLConverter'),
  require('../packages/bibliography/BibItemXMLConverter'),
  require('../packages/figures/ImageFigureXMLConverter'),

  require('../packages/figures/ImageFigureCitationXMLConverter'),
  require('../packages/bibliography/BibItemCitationXMLConverter'),
];

function LensArticleImporter() {
  LensArticleImporter.super.call(this, {
    schema: articleSchema,
    converters: converters,
    DocumentClass: LensArticle
  });
}

LensArticleImporter.Prototype = function() {

  // XML import
  // <article>
  //   <meta>...</meta>
  //   <resources>...</resources>
  //   <body>...</body>
  // </article>
  this.convertDocument = function(articleElement) {
    // Import meta node
    var metaElement = articleElement.find('metadata');
    this.convertElement(metaElement);

    // Import resources
    var resources = articleElement.find('resources');
    resources.children.forEach(function(resource) {
      this.convertElement(resource);
    }.bind(this));

    // Import main container
    var bodyNodes = articleElement.find('body').children;
    this.convertContainer(bodyNodes, 'main');
  };
};

// Expose converters so we can reuse them in NoteHtmlExporter
LensArticleImporter.converters = converters;

oo.inherit(LensArticleImporter, XMLImporter);
module.exports = LensArticleImporter;