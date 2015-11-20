var Figure = require('substance/packages/figure/Figure');

var ImageFigure = Figure.extend();

ImageFigure.static.name = "image-figure";
ImageFigure.static.citationType = 'image-figure-citation';
ImageFigure.static.isBlock = true;

module.exports = ImageFigure;
