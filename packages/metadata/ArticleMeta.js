var $ = require('substance/util/jquery');
var DocumentNode = require('substance/model/DocumentNode');

var ArticleMeta = DocumentNode.extend();

ArticleMeta.static.name = "article-meta";

ArticleMeta.static.defineSchema({
  "title": "string",
  "authors": ["array", "string"],
  "abstract": "string"
});

module.exports = ArticleMeta;
