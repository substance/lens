'use strict';

var createDocumentFactory = require('substance/model/createDocumentFactory');
var LensArticle = require('./LensArticle');

module.exports = createDocumentFactory(LensArticle, function(tx) {
  var body = tx.get('body');

  // TODO: allow provision of initial title
  tx.set(['article-meta', 'title'], 'Untitled');
  tx.set(['article-meta', 'abstract'], 'Enter abstract');

  tx.create({
    id: 'p1',
    type: 'paragraph',
    content: 'Enter text here'
  });
  body.show('p1');
});