'use strict';

var CitationCommand = require('../citations/CitationCommand');

var BibItemCitationCommand = CitationCommand.extend({
  static: {
    name: 'bibItemCitation',
    annotationType: 'bib-item-citation'
  }
});

module.exports = BibItemCitationCommand;