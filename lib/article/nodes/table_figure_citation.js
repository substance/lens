var Substance = require('substance');
var Citation = require('./citation');

var TableFigureCitation = Citation.extend({
  name: "table_figure_citation",

  getItemType: function() {
    return "table_figure";
  },
});

TableFigureCitation.static.matchElement = function($el) {
  return $el.is(TableFigureCitation.static.tagName) && $el.attr('data-rtype') === 'table_figure';
};

TableFigureCitation.static.fromHtml = function($el, converter) {
  return Citation.static.fromHtml($el, converter);
};

TableFigureCitation.static.toHtml = function(citation, converter) {
  var $el = Citation.static.toHtml(citation, converter);
  // Add specific type
  $el.attr("data-rtype", "table_figure");
  return $el;
};


module.exports = TableFigureCitation;
