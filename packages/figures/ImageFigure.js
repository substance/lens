'use strict';

var Figure = require('substance/packages/figure/Figure');

function ImageFigure() {
  ImageFigure.super.apply(this, arguments);
}

Figure.extend(ImageFigure);

ImageFigure.static.name = "image-figure";
ImageFigure.static.citationType = 'image-figure-citation';
ImageFigure.static.isBlock = true;

module.exports = ImageFigure;
