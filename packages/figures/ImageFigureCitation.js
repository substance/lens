var Citation = require('../citations/Citation');

var ImageFigureCitation = Citation.extend({
  name: "image-figure-citation",
  getItemType: function() {
    return "image-figure";
  },
});

module.exports = ImageFigureCitation;
