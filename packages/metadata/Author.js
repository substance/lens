
var $ = require('substance/util/jquery');
var DocumentNode = require('substance/model/DocumentNode');

var Author = DocumentNode.extend({
  name: "author",
  properties: {
    "name": "string"
  }
});


 
module.exports = Author;
