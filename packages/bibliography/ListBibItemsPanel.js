'use strict';

var _ = require('substance/util/helpers');
var oo = require('substance/util/oo');
var Component = require('substance/ui/Component');
var $$ = Component.$$;

// List existing bib items
// -----------------

function ListBibItemsPanel() {
  Component.apply(this, arguments);
}

ListBibItemsPanel.Prototype = function() {

  this.getInitialState = function() {
    var doc = this.props.doc;
    var bibliography = doc.getBibliography();
    bibliography.compile();
    return {
      bibItems: bibliography.getCompiledItems()
    };
  };

  this.render = function() {
    var el = $$('div').addClass('content bib-items');
    var bibItems = _.map(this.state.bibItems, function(entry) {
      return $$('div').addClass('csl-entry clearfix border-bottom').append(
        $$('div')
          .addClass('csl-left-margin')
          .append(entry.label),
        $$('button')
          .addClass('button delete-button float-right small plain')
          .attr("data-id", entry.id)
          .on('click', this.handleDeleteBibItem)
          .append(this.i18n.t("delete")),
        $$('div')
          .addClass('csl-right-inline')
          .append(entry.text)
      );
    }, this);
    return el.append(bibItems);
  };

  this.handleDeleteBibItem = function(e) {
    e.preventDefault();
    var bibItemId = e.currentTarget.dataset.id;
    var doc = this.props.doc;

    doc.deleteBibItem(bibItemId);
    var bibliography = doc.getBibliography();
    // Recompile bibliography
    bibliography.compile();
    var bibItems = bibliography.getCompiledItems();
    this.setState({
      bibItems: bibItems
    });
  };
};

oo.inherit(ListBibItemsPanel, Component);

module.exports = ListBibItemsPanel;
