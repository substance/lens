var Substance = require('substance');
var $ = require('substance/basics/jquery');

var Author = Substance.Document.Node.extend({
  name: "author",
  properties: {
    "name": "string"
  }
});

// HtmlImporter

Author.static.matchElement = function($el) {
  return $el.is("author");
};

Author.static.fromHtml = function($el, converter) {
  var id = converter.defaultId($el, 'author');
  var author = {
    id: id,
    name: $el.text()
  };
  return author;
};

// HtmlExporter

Author.static.toHtml = function(author, converter) {
  /* jshint unused: false */
  var $el = $('<author>')
    .attr('id', author.id)
    .attr('name', author.name);
  return $el;
};
 
module.exports = Author;
