var Citation = require('../citations/Citation');

var ImageFigureCitation = Citation.extend({
  name: "image-figure-citation",
  getItemType: function() {
    return "image-figure";
  },
});

ImageFigureCitation.static.matchElement = function($el) {
  return $el.is(ImageFigureCitation.static.tagName) && $el.attr('data-rtype') === 'image-figure';
};

ImageFigureCitation.static.fromHtml = function($el, converter) {
  return Citation.static.fromHtml($el, converter);
};

ImageFigureCitation.static.toHtml = function(citation, converter) {
  var $el = Citation.static.toHtml(citation, converter);
  // Add specific type
  $el.attr("data-rtype", "image-figure");
  return $el;
};

module.exports = ImageFigureCitation;
