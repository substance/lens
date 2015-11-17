'use strict';

var compact = require('lodash/array/compact');

// This is never used directly
module.exports = {

  type: 'citation',

  import: function(el, node) {
    node.id = el.attr('id') || node.id; // legacy ids
    node.targets = compact(el.attr('data-rid').split(' '));
  },

  export: function(node, el) {
    var targets = node.targets.join(' ');
    el.attr('data-rid', targets);
  }
};