'use strict';

var Substance = require('substance');
var _ = require('substance/helpers');

class Collection {
  constructor(doc, containerId, itemType) {
    this.doc = doc;
    this.containerId = containerId;
    this.itemType = itemType || 'bib_item';

    this.itemsByGuid = {};
    this._compileDebounced = _.debounce(this.compile.bind(this), 50);  
  }

  getCitations() {
    return this.doc.getIndex('type').get(this.itemType+'_citation');
  }

  getDocument() {
    return this.doc;
  }

  getCompiler() {
    throw new Error('This method is abstract. Please implement');
  }

  // Get source for item so the compiler can work on it
  getSource(item) {
    return item;
  }

  compile() {
    console.log('Compiling collection', this.itemType);
    var doc = this.getDocument();
    var compiler = this.getCompiler();
    var container = doc.get(this.containerId);

    // clear information remaining from the previous compilation
    compiler.clear();

    var items = doc.getIndex('type').get(this.itemType);
    this.itemsByGuid = {};

    _.each(items, function(item) {
      var source = this.getSource(item);
      compiler.addRecord(source);
      this.itemsByGuid[item.guid] = item;
    }, this);

    // Manage citations
    // --------------------

    var citations = this.getCitations();

    // generate information for sorting
    var citationItems = _.map(citations, function(citation) {
      var comp = container.getComponent(citation.path);
      return {
        citation: citation,
        comp: comp
      };
    });
    // sort citation by occurrence in the container
    citationItems.sort(function(a, b) {
      var result = a.comp.getIndex() - b.comp.getIndex();
      if (result === 0) {
        result = a.citation.startOffset - b.citation.startOffset;
      }
      return result;
    });

    // compile each label
    _.each(citationItems, function(item) {
      var citation = item.citation;
      var compiledCitation = this.getCompiler().addCitation(citation.targets);
      citation.setLabel(compiledCitation.label);
    }, this);
  }

  update() {
    this._compileDebounced();
  }

  // makeBibliography() {
  //   return this.getCompiler().engine.makeBibliography();
  // }

  // TODO: maybe we should this make the default this.getBibItems ?
  getCompiledItems() {
    var items = [];
    var ids = this.getCompiler().getSortedIds();
    for (var i = 0; i < ids.length; i++) {
      items.push(this.doc.get(ids[i]));
    }

    var doc = this.getDocument();
    var citeprocCompiler = doc.getCiteprocCompiler();
    var compiledItems = [];

    // console.log('YAY', this.getCompiler().retrieveItem('bib1'));

    _.each(items, function(item, index) {
      compiledItems.push({
        id: item.id,
        data: item.data,
        label: index+1,
        text: citeprocCompiler.renderReference(item.data)
      });
    });
    return compiledItems;
  }
}

Substance.initClass(Collection);
module.exports = Collection;
