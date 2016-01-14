'use strict';

var AnnotationTool = require('substance/ui/AnnotationTool');

function ImageFigureCitationTool() {
  ImageFigureCitationTool.super.apply(this, arguments);
}

AnnotationTool.extend(ImageFigureCitationTool);

ImageFigureCitationTool.static.name = 'imageFigureCitation';
ImageFigureCitationTool.static.command = 'imageFigureCitation';

module.exports = ImageFigureCitationTool;
