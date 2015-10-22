'use strict';

var CitationCommand = require('../citations/CitationCommand');

var BibItemCitationCommand = CitationCommand.extend({
  static: {
    name: 'toggleBibItemCitation',
    annotationType: 'bib_item_citation'
  }
});

module.exports = BibItemCitationCommand;