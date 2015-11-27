var _ = require('substance/util/helpers');
var $ = require('substance/util/jquery');
var InlineNode = require('substance/model/InlineNode');

function Citation() {
  Citation.super.apply(this, arguments);
}

InlineNode.extend(Citation, {

  getDefaultProperties: function() {
    return {targets: []};
  },

  setLabel: function(label) {
    if (this.label !== label) {
      this.label = label;
      this.emit('label:changed');
    }
  },

  onTargetChange: function(change, info, doc) {
    this.updateCollection(doc);
  }

});

Citation.static.name = "citation";

Citation.static.defineSchema({
  targets: ["array", "id"],
  // volatile properties
  // label: computed dynamically
});

Citation.static.tagName = 'cite';

module.exports = Citation;
