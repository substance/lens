'use strict';

var Citation = require('../citations/Citation');

function ImageFigureCitation() {
  ImageFigureCitation.super.apply(this, arguments);
}

ImageFigureCitation.Prototype = function() {
  this.getItemType = function() {
    return "image-figure";
  };
};

Citation.extend(ImageFigureCitation);

ImageFigureCitation.static.name = "image-figure-citation";

module.exports = ImageFigureCitation;
