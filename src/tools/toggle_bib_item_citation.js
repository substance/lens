'use strict';

var AnnotationTool = require('substance/ui/tools/annotation_tool');

var BibItemCitationTool = AnnotationTool.extend({
  static: {
    name: 'Bibliographic Citation',
    command: 'toggleBibItemCitation'
  }
});

module.exports = BibItemCitationTool;