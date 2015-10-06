'use strict';

var AnnotationTool = require('substance/ui/tools/annotation_tool');

var ToggleImageFigureCitation = AnnotationTool.extend({
  static: {
    name: 'Figure Citation',
    command: 'toggleImageFigureCitation'
  }
});

module.exports = ToggleImageFigureCitation;