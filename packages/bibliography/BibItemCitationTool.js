'use strict';

var AnnotationTool = require('substance/ui/AnnotationTool');

function BibItemCitationTool() {
  BibItemCitationTool.super.apply(this, arguments);
}

AnnotationTool.extend(BibItemCitationTool);

BibItemCitationTool.static.name = 'bibItemCitation';
BibItemCitationTool.static.command = 'bibItemCitation';

module.exports = BibItemCitationTool;
