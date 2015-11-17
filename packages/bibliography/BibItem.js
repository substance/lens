var $ = require('substance/util/jquery');
var DocumentNode = require('substance/model/DocumentNode');

var BibItem = DocumentNode.extend({
  name: 'bib-item',

  properties : {
    source: 'string',
    format: 'string'
    // Additionally we have following volative data fields
    // data: parsed JSON or source
    // guid: globally unique id (such as DOI or ISSN)
  },

  setLabel: function(label) {
    this.label = label;
    this.emit('label', label);
  },

  // Store compiled text version of the bib item
  // See bib/bibliography.js
  setText: function(compiledText) {
    this.text = compiledText;
  },

  didInitialize: function() {
    // Only if citeproc
    if (this.format === "citeproc") {
      this.data = JSON.parse(this.source);
      this.guid = this.data.DOI || this.data.ISSN || this.id;
    } else {
      this.data = this.source;
      this.guid = this.id;
    }
  },

  // Note: we are updating the collection whenever
  // a BibItem is created so that we have its text compiled.
  // This is a different to Table or Figure collections
  // a compilation is done when the figure is shown or hidden
  // in the container.

  didAttach: function(doc) {
    if (!doc.isTransaction() && !doc.isClipboard()) {
      this.updateCollection(doc);
    }
  },

  didDetach: function(doc) {
    if (!doc.isTransaction() && !doc.isClipboard()) {
      this.updateCollection(doc);
    }
  },

  updateCollection: function(doc) {
    var collection = doc.getCollection(this.type);
    if (collection) {
      collection.update();
    }
  }
});

BibItem.static.citationType = "bib-item-citation";



module.exports = BibItem;
