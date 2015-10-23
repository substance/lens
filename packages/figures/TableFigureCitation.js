var Citation = require('../citations/Citation');

var TableFigureCitation = Citation.extend({
  name: "table-figure-citation",

  getItemType: function() {
    return "table-figure";
  },
});

TableFigureCitation.static.matchElement = function($el) {
  return $el.is(TableFigureCitation.static.tagName) && $el.attr('data-rtype') === 'table-figure';
};

TableFigureCitation.static.fromHtml = function($el, converter) {
  return Citation.static.fromHtml($el, converter);
};

TableFigureCitation.static.toHtml = function(citation, converter) {
  var $el = Citation.static.toHtml(citation, converter);
  // Add specific type
  $el.attr("data-rtype", "table-figure");
  return $el;
};


module.exports = TableFigureCitation;
