var Substance = require('substance');
var Citation = require('./citation');

var ImageFigureCitation = Citation.extend({
  name: "image_figure_citation",
  getItemType: function() {
    return "image_figure";
  },
});

ImageFigureCitation.static.matchElement = function($el) {
  return $el.is(ImageFigureCitation.static.tagName) && $el.attr('typeof') === 'fig';
};

ImageFigureCitation.static.fromHtml = function($el, converter) {
  return Citation.static.fromHtml($el, converter);
};

ImageFigureCitation.static.toHtml = function(citation, converter) {
  var $el = Citation.static.toHtml(citation, converter);
  // Add specific type
  $el.attr("typeof", "fig");
  return $el;
};

module.exports = ImageFigureCitation;
