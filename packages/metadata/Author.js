
var $ = require('substance/util/jquery');
var DocumentNode = require('substance/model/DocumentNode');

var Author = DocumentNode.extend();

Author.static.name = "author";

Author.static.defineSchema({
  "name": "string"
});

module.exports = Author;
