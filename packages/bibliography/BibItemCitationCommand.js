'use strict';

var CitationCommand = require('../citations/CitationCommand');

function BibItemCitationCommand() {
  BibItemCitationCommand.super.apply(this, arguments);
}

CitationCommand.extend(BibItemCitationCommand);

BibItemCitationCommand.static.name = 'bibItemCitation';
BibItemCitationCommand.static.annotationType = 'bib-item-citation';

module.exports = BibItemCitationCommand;