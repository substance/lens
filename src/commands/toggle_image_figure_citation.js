'use strict';

var CitationCommand = require('./citation_command');

var ToggleImageFigureCitationCommand = CitationCommand.extend({
  static: {
    name: 'toggleImageFigureCitation',
    annotationType: 'image_figure_citation'
  }
});

module.exports = ToggleImageFigureCitationCommand;