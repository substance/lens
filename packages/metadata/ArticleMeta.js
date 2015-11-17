var $ = require('substance/util/jquery');
var DocumentNode = require('substance/model/DocumentNode');

var ArticleMeta = DocumentNode.extend({
  name: "article-meta",
  properties: {
    "title": "string",
    "authors": ["array", "string"],
    "abstract": "string"
  }
});

module.exports = ArticleMeta;
