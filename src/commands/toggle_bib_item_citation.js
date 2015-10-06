'use strict';

var CitationCommand = require('./citation_command');

var ToggleBibItemCitationCommand = CitationCommand.extend({
  static: {
    name: 'toggleBibItemCitation',
    annotationType: 'bib_item_citation'
  }
});

module.exports = ToggleBibItemCitationCommand;