'use strict';

var AnnotationTool = require('substance/ui/AnnotationTool');

var ImageFigureCitationTool = AnnotationTool.extend({
  static: {
    name: 'Figure Citation',
    command: 'toggleImageFigureCitation'
  }
});

module.exports = ImageFigureCitationTool;