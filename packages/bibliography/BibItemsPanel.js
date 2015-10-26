'use strict';

var oo = require('substance/util/oo');
var Panel = require('substance/ui/Panel');
var Component = require('substance/ui/Component');
var BibItemComponent = require('./BibItemComponent');
var $$ = Component.$$;

var BibliographySummary = Component.extend({
  render: function() {
    var el = $$('div').addClass('se-bibliography-summary');

    el.append(
      $$('p').append(
        'Your bibliography has ',
        $$('strong').append(this.props.bibItems.length.toString(), ' references'),
        ' in total.'
        // $$('strong').append('? references'),
        // 'are not cited.'
      )
    );

    var config = this.context.config;
    if (config.isEditable) {
      el.append(
        $$('p').append(
          $$('a').attr({href: '#'}).append('Add references')
        )
      );
    }
    return el;
  }
});

// List existing bib items
// -----------------

function BibItemsPanel() {
  Panel.apply(this, arguments);

  var doc = this.props.doc;
  this.bibliography = doc.getCollection('bib-item');
  this.bibliography.connect(this, {
    'bibliography:updated': this.rerender
  });
}

BibItemsPanel.Prototype = function() {

  this.dispose = function() {
    this.bibliography.disconnect();
  };

  this.didMount = function() {
    var bibItemId = this.getFirstActiveBibItemId();
    if (bibItemId) {
      this.scrollToNode(bibItemId);
    }
  };

  this.getFirstActiveBibItemId = function() {
    var doc = this.props.doc;
    if (this.props.bibItemId) {
      return this.props.bibItemId;
    }

    if (this.props.citationId) {
      var citation = doc.get(this.props.citationId);
      return citation.targets[0];
    }
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
    var bibItems = this.bibliography.getItems();
    var el = $$('div').addClass('sc-bib-items-panel panel');
    var bibItemEls = $$('div').addClass('panel-content').ref('panelContent');

    bibItemEls.append($$(BibliographySummary, {bibItems: bibItems}));

    bibItems.forEach(function(bibItem) {
      bibItemEls.append($$(BibItemComponent, {
        node: bibItem,
        highlighted: this.isHighlighted(bibItem)
      }));
    }.bind(this));
    el.append(bibItemEls);
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
