'use strict';

var Component = require('substance/ui/Component');
var ScrollPane = require('substance/ui/ScrollPane');
var BibItemComponent = require('./BibItemComponent');
var BibliographySummary = require('./BibliographySummary');
var $$ = Component.$$;

// List existing bib items
// -----------------

function BibItemsPanel() {
  Component.apply(this, arguments);

  var doc = this.props.doc;
  this.bibliography = doc.getCollection('bib-item');
  this.bibliography.connect(this, {
    'bibliography:updated': this.rerender
  });
}

BibItemsPanel.Prototype = function() {

  this.dispose = function() {
    this.bibliography.disconnect(this);
  };

  this.didMount = function() {
    this._scrollToTarget();
  };

  this.didReceiveProps = function() {
    this._scrollToTarget();
  };

  this._scrollToTarget = function() {
    var bibItemId = this.getFirstActiveBibItemId();
    if (bibItemId) {
      this.refs.scrollPane.scrollTo(bibItemId);
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

    var bibItemEls = $$('div').addClass('se-bib-items').ref('bibItems');
    bibItemEls.append($$(BibliographySummary, {bibItems: bibItems}));

    bibItems.forEach(function(bibItem) {
      bibItemEls.append($$(BibItemComponent, {
        node: bibItem,
        toggleName: this.i18n.t('focus'),
        highlighted: this.isHighlighted(bibItem)
      }));
    }.bind(this));

    var el = $$('div').addClass('sc-bib-items-panel').append(
      $$(ScrollPane, {doc: this.props.doc}).append(
        bibItemEls
      ).ref('scrollPane')
    );

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

Component.extend(BibItemsPanel);

module.exports = BibItemsPanel;
