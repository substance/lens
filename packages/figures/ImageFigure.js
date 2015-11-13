var Figure = require('substance/packages/figure/Figure');

var ImageFigure = Figure.extend({
  name: "image-figure"
});

ImageFigure.static.citationType = "image-figure-citation";
ImageFigure.static.blockType = true;

// HtmlImporter

ImageFigure.static.matchElement = function($el) {
  return $el.is('image-figure');
};

ImageFigure.static.fromHtml = function($el, converter) {
  var imageFigure = Figure.static.fromHtml($el, converter);
  var contentNode;

  // HACK: We abuse this for embed nodes, as they can't live on their own atm
  var $img = $el.find('img');
  var $embed = $el.find('embed');
  if ($img.length > 0) {
    contentNode = converter.convertElement($img, { parent: imageFigure.id });
  } else if ($embed.length > 0) {
    contentNode = converter.convertElement($embed, { parent: imageFigure.id });
  }
  
  imageFigure.content = contentNode.id;
  return imageFigure;
};

// HtmlExporter

ImageFigure.static.toHtml = function(figure, converter) {
  return Figure.static.toHtml('image-figure', figure, converter);
};

module.exports = ImageFigure;
