var Citation = require('../citations/Citation');

var ImageFigureCitation = Citation.extend({
  getItemType: function() {
    return "image-figure";
  },
});

ImageFigureCitation.static.name = "image-figure-citation";

module.exports = ImageFigureCitation;
