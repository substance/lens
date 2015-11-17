'use strict';

/*
  BibItem XML Converter
*/
module.exports = {

  type: 'bib-item',
  tagName: 'bib',

  import: function(el, node) {
    node.id = el.attr('id') || node.id; // legacy ids
    node.format = 'citeproc';
    node.source = el.text();
  },

  export: function(node, el) {
    el.attr('format', 'citeproc')
      .attr('data-id', node.id)
      .text(JSON.stringify(node.data));
  }
};
