'use strict';

/*
  BibItem XML Converter
*/
module.exports = {

  type: 'bib-item',
  tagName: 'bib',

  import: function(el, node) {
    node.data = JSON.parse(el.text());
    node.id = node.data.DOI;
    node.format = 'citeproc';
  },

  export: function(node, el) {
    el.attr('format', 'citeproc')
      .attr('data-id', node.id)
      .text(JSON.stringify(node.data));
  }
};
