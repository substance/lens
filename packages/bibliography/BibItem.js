var $ = require('substance/util/jquery');
var DocumentNode = require('substance/model/DocumentNode');

function BibItem() {
  BibItem.super.apply(this, arguments);
}

DocumentNode.extend(BibItem, {

  setLabel: function(label) {
    this.label = label;
    this.emit('label', label);
  },

  // Store compiled text version of the bib item
  // See bib/bibliography.js
  setText: function(compiledText) {
    this.text = compiledText;
  },

  updateCollection: function(doc) {
    var collection = doc.getCollection(this.type);
    if (collection) {
      collection.update();
    }
  }
});

BibItem.static.name = 'bib-item';

BibItem.static.defineSchema({
    format: 'string',
    data: 'object'
});

BibItem.static.citationType = "bib-item-citation";

module.exports = BibItem;
