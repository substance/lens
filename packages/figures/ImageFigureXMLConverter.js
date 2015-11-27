'use strict';

var FigureXMLConverter = require('substance/packages/figure/FigureXMLConverter');

module.exports = {

  type: 'image-figure',
  tagName: 'image-figure',

  import: function(el, node, converter) {
    FigureXMLConverter.import(el, node, converter);

    node.id = el.attr('id') || node.id; // legacy ids

    var contentNode;
    // HACK: We abuse this for embed nodes, as they can't live on their own atm
    var image = el.find('image');
    var embed = el.find('embed');
    if (image) {
      contentNode = converter.convertElement(image/*, { parent: imageFigure.id }*/);
    } else if (embed) {
      contentNode = converter.convertElement(embed/*, { parent: imageFigure.id }*/);
    }
    node.content = contentNode.id;
  },

  export: function(node, el, converter) {
    FigureXMLConverter.export(node, el, converter);
  }
};