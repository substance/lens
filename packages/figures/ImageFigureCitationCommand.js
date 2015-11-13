'use strict';

var CitationCommand = require('../citations/CitationCommand');

var ImageFigureCitationCommand = CitationCommand.extend({
  static: {
    name: 'imageFigureCitation',
    annotationType: 'image-figure-citation'
  }
});

module.exports = ImageFigureCitationCommand;