'use strict';

var AnnotationTool = require('substance/ui/AnnotationTool');

var BibItemCitationTool = AnnotationTool.extend({
  static: {
    name: 'Bibliographic Citation',
    command: 'toggleBibItemCitation'
  }
});

module.exports = BibItemCitationTool;