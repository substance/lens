'use strict';

var _ = require('substance/util/helpers');
var oo = require('substance/util/oo');
var EventEmitter = require('substance/util/EventEmitter');

// Nomenclature: 'Bibliography' is a set of 'References' which are cited from in the manuscript.

function Bibliography(doc, containerId) {
  EventEmitter.call(this);
  this.doc = doc;
  this.containerId = containerId;

  this.bibitemsByGuid = {};
  this._compileDebounced = _.debounce(this.compile.bind(this), 50);
}

Bibliography.Prototype = function() {

  this.dispose = function() {
    this.doc.disconnect(this);
  };

  this.getDocument = function() {
    return this.doc;
  };

  this.getCompiler = function() {
    return this.getDocument().getCiteprocCompiler();
  };

  this.compile = function() {
    // console.log('Compiling bibliography');
    var doc = this.getDocument();
    var compiler = this.getCompiler();
    var container = doc.get(this.containerId);
    // clear information remaining from the previous compilation
    compiler.clear();

    var bibItems = doc.getIndex('type').get('bib-item');
    this.bibitemsByGuid = {};

    _.each(bibItems, function(bibItem) {
      // TODO: this works only with citeproc type of bibitems
      if (bibItem.format !== 'citeproc') {
        throw new Error("Only 'citeproc' bibliographic items are supported right now.");
      }
      var source = bibItem.source;
      var data = JSON.parse(source);
      data.id = bibItem.id;
      compiler.addRecord(data);
      this.bibitemsByGuid[bibItem.guid] = bibItem;
    }, this);

    // get citation nodes sorted by occurrence position.
    var citations = doc.getIndex('type').get('bib-item-citation');
    // generate information for sorting
    var citationItems = _.map(citations, function(citation) {
      var address = container.getAddress(citation.path);
      return {
        citation: citation,
        address: address
      };
    });
    // sort citation by occurrence in the container
    citationItems.sort(function(a, b) {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return a.citation.startOffset - b.citation.startOffset;
      }
    });
    // compile each label
    _.each(citationItems, function(item) {
      var citation = item.citation;
      if (citation.targets.length>0) {
        var targets = _.filter(citation.targets, function(id) {
          var found = !!bibItems[id];
          if (!found) {
            console.error('No Bibitem found with id', id);
          }
          return found;
        });
        var compiledCitation = this.getCompiler().addCitation(targets);
        citation.setLabel(compiledCitation.label);
      } else {
        citation.setLabel('???');
      }
    }, this);

    var compiledBibItems = this.getCompiler().makeBibliography();
    compiledBibItems = _.sortBy(compiledBibItems, "rank");
    this.sortedBibItems = _.map(compiledBibItems, function(item) {
      var bibItem = bibItems[item.id];
      bibItem.setLabel(item.label);
      bibItem.setText(item.content);
      return bibItem;
    }, this);

    this.emit('bibliography:updated');
  };

  this.update = function() {
    // Unfortunately, we need this, as at the moment a compile is triggered whenever a citation is created.
    // And, when deleting or pasting a block with lots of citation this would get very slow.
    this._compileDebounced();
    // this.compile();
  };

  this.makeBibliography = function() {
    return this.getCompiler().makeBibliography();
  };

  // Return all available bib items (= references sorted by occurence of first citation in paper)
  this.getBibItems = function() {
    var result = [];
    var ids = this.getCompiler().getSortedIds();
    for (var i = 0; i < ids.length; i++) {
      result.push(this.doc.get(ids[i]));
    }
    return result;
  };

  // TODO: maybe we should this make the default this.getBibItems ?
  this.getCompiledItems =  function() {
    return this.sortedBibItems;
  };

  this.getItems = function() {
    return this.getCompiledItems();
  };
};


oo.inherit(Bibliography, EventEmitter);

module.exports = Bibliography;