var Substance = require('substance');

var Figure = require('./figure');

var ImageFigure = Figure.extend({
  name: "image_figure"
});

ImageFigure.static.citationType = "image_figure_citation";
ImageFigure.static.blockType = true;

// HtmlImporter

ImageFigure.static.matchElement = function($el) {
  return $el.is('image-figure');
};

ImageFigure.static.fromHtml = function($el, converter) {
  var imageFigure = Figure.static.fromHtml($el, converter);
  var imageNode = converter.convertElement($el.find('img'), { parent: imageFigure.id });
  imageFigure.content = imageNode.id;
  return imageFigure;
};

// HtmlExporter

ImageFigure.static.toHtml = function(figure, converter) {
  return Figure.static.toHtml('image-figure', figure, converter);
};

module.exports = ImageFigure;
