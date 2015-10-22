var Substance = require('substance');
var Figure = require('substance/packages/figure/Figure');

var TableFigure = Figure.extend({
  name: "table-figure",
});

TableFigure.static.components = ['title', 'content', 'caption'];
TableFigure.static.citationType = "table-figure-citation";
TableFigure.static.blockType = true;

// HtmlImporter

TableFigure.static.matchElement = function($el) {
  return $el.is('table-figure');
};

TableFigure.static.fromHtml = function($el, converter) {
  var tableFigure = Figure.static.fromHtml($el, converter);
  var tableNode = converter.convertElement($el.find('table'), { parent: tableFigure.id });
  tableFigure.content = tableNode.id;
  return tableFigure;
};

// HtmlExporter

TableFigure.static.toHtml = function(figure, converter) {
  return Figure.static.toHtml('table-figure', figure, converter);
};

module.exports = TableFigure;
