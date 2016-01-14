'use strict';

var InlineNode = require('substance/model/InlineNode');

function Citation() {
  Citation.super.apply(this, arguments);
}

Citation.Prototype = function() {

  this.getDefaultProperties = function() {
    return {
      targets: []
    };
  };

  this.setLabel = function(label) {
    if (this.label !== label) {
      this.label = label;
      this.emit('label:changed');
    }
  };

  this.onTargetChange = function(change, info, doc) {
    this.updateCollection(doc);
  };

};

InlineNode.extend(Citation);

Citation.static.name = "citation";

Citation.static.defineSchema({
  targets: ["array", "id"],
  // volatile properties
  // label: computed dynamically
});

Citation.static.tagName = 'cite';

module.exports = Citation;
