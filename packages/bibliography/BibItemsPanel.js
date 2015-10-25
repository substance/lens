'use strict';

var oo = require('substance/util/oo');
var Panel = require('substance/ui/Panel');
var Component = require('substance/ui/Component');

var BibItemComponent = require('./BibItemComponent');
var $$ = Component.$$;

// List existing bib items
// -----------------

function BibItemsPanel() {
  Panel.apply(this, arguments);
}

BibItemsPanel.Prototype = function() {

  this.getInitialState = function() {
    var doc = this.props.doc;
    var bibliography = doc.getBibliography();
    bibliography.compile();
    return {
      bibItems: bibliography.getCompiledItems()
    };
  };

  this.isHighlighted = function(bibItem) {
    var doc = this.props.doc;
    if (this.props.bibItemId === bibItem.id) {
      return true;
    }

    if (this.props.citationId) {
      var citation = doc.get(this.props.citationId);
      if (citation.targets && citation.targets.indexOf(bibItem.id) >= 0) {
        return true;
      }
    }
    return false;
  };

  this.render = function() {
    var el = $$('div').addClass('sc-bib-items-panel panel');
    var bibItems = $$('div').addClass('panel-content');

    this.state.bibItems.forEach(function(bibItem) {
      bibItems.append($$(BibItemComponent, {
        node: bibItem,
        highlighted: this.isHighlighted(bibItem)
      }));
    }.bind(this));
    el.append(bibItems);
    return el;
  };

  // this.handleDeleteBibItem = function(e) {
  //   e.preventDefault();
  //   var bibItemId = e.currentTarget.dataset.id;
  //   var doc = this.props.doc;

  //   doc.deleteBibItem(bibItemId);
  //   var bibliography = doc.getBibliography();
  //   // Recompile bibliography
  //   bibliography.compile();
  //   var bibItems = bibliography.getCompiledItems();
  //   this.setState({
  //     bibItems: bibItems
  //   });
  // };
};

oo.inherit(BibItemsPanel, Panel);

module.exports = BibItemsPanel;
