'use strict';

var CitationCommand = require('../citations/CitationCommand');

function ImageFigureCitationCommand() {
  ImageFigureCitationCommand.super.apply(this, arguments);
}

CitationCommand.extend(ImageFigureCitationCommand);

ImageFigureCitationCommand.static.name = 'imageFigureCitation';
ImageFigureCitationCommand.static.annotationType = 'image-figure-citation';

module.exports = ImageFigureCitationCommand;
