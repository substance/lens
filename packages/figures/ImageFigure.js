var Figure = require('substance/packages/figure/Figure');

var ImageFigure = Figure.extend({
  name: "image-figure"
});

ImageFigure.static.citationType = 'image-figure-citation';
ImageFigure.static.blockType = true;

module.exports = ImageFigure;
