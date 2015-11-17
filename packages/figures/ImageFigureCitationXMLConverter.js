'use strict';

var CitationXMLConverter = require('../citations/CitationXMLConverter');

module.exports = {

  type: 'image-figure-citation',
  tagName: 'cite',

  matchElement: function(el) {
    return el.is('cite') && el.attr('data-rtype') === 'image-figure';
  },

  import: function(el, node) {
    CitationXMLConverter.import(el, node);
  },

  export: function(node, el) {
    CitationXMLConverter.export(node, el);
    // Add specific type
    el.attr("data-rtype", "image-figure");
  }
};