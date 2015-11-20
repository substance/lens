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

  didAttach: function(doc) {
    if (!doc.isTransaction() && !doc.isClipboard()) {
      doc.getEventProxy('path').connect(this, [this.id, 'targets'], this.onTargetChange);
      // doc.getEventProxy('path').connect(this, [this.id, 'path'], this.onChange);
      this.updateCollection(doc);
    }
  },

  didDetach: function(doc) {
    // TODO: still not good...
    doc.getEventProxy('path').disconnect(this, [this.id, 'targets']);
    // doc.getEventProxy('path').disconnect(this, [this.id, 'path']);
    this.updateCollection(doc);
  },

  updateCollection: function(doc) {
    var collection = doc.getCollection(this.getItemType());
    if (collection) {
      collection.update();
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

Citation.static.external = true;

module.exports = Citation;
