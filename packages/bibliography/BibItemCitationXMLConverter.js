'use strict';

var CitationXMLConverter = require('../citations/CitationXMLConverter');

module.exports = {

  type: 'bib-item-citation',
  tagName: 'cite',

  matchElement: function(el) {
    return el.is('cite') && el.attr('rtype') === 'bib';
  },

  import: function(el, node) {
    CitationXMLConverter.import(el, node);
  },

  export: function(node, el) {
    CitationXMLConverter.export(node, el);
    // Add specific type
    el.attr('rtype', 'bib');
  }
};