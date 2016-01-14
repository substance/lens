'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function ArticleMeta() {
  ArticleMeta.super.apply(this, arguments);
}

DocumentNode.extend(ArticleMeta);

ArticleMeta.static.name = "article-meta";

ArticleMeta.static.defineSchema({
  "title": "string",
  "authors": ["array", "string"],
  "abstract": "string"
});

module.exports = ArticleMeta;
