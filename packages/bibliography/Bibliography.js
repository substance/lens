'use strict';

var _ = require('substance/util/helpers');
var EventEmitter = require('substance/util/EventEmitter');
var sortBy = require('lodash/collection/sortBy');

// Nomenclature: 'Bibliography' is a set of 'References' which are cited from in the manuscript.

function Bibliography(doc, containerId) {
  EventEmitter.call(this);
  this.doc = doc;
  this.containerId = containerId;

  this.bibitemsByGuid = {};
  this._compileDebounced = _.debounce(this.compile.bind(this), 50);

  this.doc.connect(this, {
    'document:changed': this.onDocumentChanged
  });
}


Bibliography.Prototype = function() {

  this.onDocumentChanged = function(change) {
    var doc = this.doc;
    var needsUpdate = false;

    _.each(change.ops, function(op) {
      if (op.isCreate() || op.isSet() || op.isUpdate()) {
        var nodeId = op.path[0];
        var node = doc.get(nodeId);
        if (!node) return;

        if (op.isCreate()) {
          // Create
          if (node.type === 'bib-item' || node.type === 'bib-item-citation') {
            needsUpdate = true;
          }
        } else {
          // Update/Set
          if (node.type === 'bib-item') {
            needsUpdate = true;
          } else if (node.type === 'bib-item-citation') {
            if (op.path[1] === 'targets') {
              needsUpdate = true;
            }
          }
        }
      } else if (op.isDelete()) {
        // Delete
        var deletedNode = op.val;
        if (deletedNode.type === 'bib-item-citation' || deletedNode.type === 'bib-item') {
          console.log('bib-item-(citation) deleted');
          needsUpdate = true;
        }
      }
    });

    if (needsUpdate) {
      // console.log('updating bibliography');
      this.update();
    }
  };

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
      var data = bibItem.data;
      data.id = bibItem.id;
      compiler.addRecord(data);
      this.bibitemsByGuid[bibItem.guid] = bibItem;
    }.bind(this));

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
    sortBy(citationItems, 'address');
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
    }.bind(this));

    var compiledBibItems = this.getCompiler().makeBibliography();
    compiledBibItems = _.sortBy(compiledBibItems, "rank");
    this.sortedBibItems = _.map(compiledBibItems, function(item) {
      var bibItem = bibItems[item.id];
      bibItem.setLabel(item.label);
      bibItem.setText(item.content);
      return bibItem;
    }.bind(this));

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
    if (!this.sortedBibItems) {
      this.compile();
    }
    return this.sortedBibItems;
  };

  this.getItems = function() {
    return this.getCompiledItems();
  };
};


EventEmitter.extend(Bibliography);

module.exports = Bibliography;