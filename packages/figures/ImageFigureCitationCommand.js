'use strict';

var CitationCommand = require('../citations/CitationCommand');

var ImageFigureCitationCommand = CitationCommand.extend({
  static: {
    name: 'toggleImageFigureCitation',
    annotationType: 'image_figure_citation'
  }
});

module.exports = ImageFigureCitationCommand;