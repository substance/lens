'use strict';

var createDocumentFactory = require('substance/model/createDocumentFactory');
var LensArticle = require('./LensArticle');

module.exports = createDocumentFactory(LensArticle, function(tx) {
  var main = tx.get('main');

  tx.create({
    id: 'article-meta',
    type: 'article-meta',
    title: 'Untitled',
    abstract: 'Enter abstract'
  });

  tx.create({
    id: 'p1',
    type: 'paragraph',
    content: 'Enter text here'
  });
  main.show('p1');
});