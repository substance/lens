'use strict';

var _ = require('substance/util/helpers');
var Component = require('substance/ui/Component');
var $$ = Component.$$;
var uuid = require('substance/util/uuid');
var Icon = require('substance/ui/FontAwesomeIcon');
var BibItemComponent = require('./BibItemComponent');

// Create new bib items using cross ref search
// -----------------

function AddBibItemsPanel() {
  Component.apply(this, arguments);

  // action handlers
  this.actions({
    "toggleBibItem": this.toggleBibItem
  });
}

AddBibItemsPanel.Prototype = function() {

  this.toggleBibItem = function(bibItem) {
    this.toggleItem(bibItem.id);
  };

  this.didMount = function() {
    // push surface selection state so that we can recover it when closing
    var $input = this.$el.find('input');
    $input.val(this.state.searchResult.searchStr).focus();
  };

  this.handleCancel = function(e) {
    e.preventDefault();
    this.send('switchContext', 'bib-items');
  };

  this.getInitialState = function() {
    return {
      searchResult: {
        query: '',
        items: []
      },
      runningQueries: [],
      addedItems: {} // still needed?
    };
  };

  this.render = function() {
    return $$('div').addClass('sc-panel sc-add-bib-items-panel sm-dialog').append(
      $$('div').addClass('se-dialog-header').append(
        $$('a').addClass('se-back').attr('href', '#')
          .on('click', this.handleCancel)
          .append($$(Icon, {icon: 'fa-chevron-left'})),
        $$('div').addClass('se-label').append(this.i18n.t('search-and-add-bib-entries'))
      ),
      $$('div').addClass('se-panel-content').ref('panelContent').append(
        $$('div').addClass("se-bib-items se-panel-content-inner").append(
          $$('div').addClass('se-search-form').append(
            $$('input')
              .attr({
                type: "text",
                placeholder: this.i18n.t('enter_search_term'),
              })
              .ref('searchStr')
              .on('keypress', this.onKeyPress),
            $$('button').addClass('button float-right')
              .append("Search")
              .on('click', this.startSearch)
          ),
          this.renderSearchResult()
        )
      )
    );
  };

  this.isAdded = function(entry) {
    var added = this.getBibItemIdByGuid(entry.data.DOI);
    return added;
  };

  // Get label for bib item if already added
  this.getLabel = function(doi) {
    var bibItemId = this.getBibItemIdByGuid(doi);
    if (!bibItemId) return undefined;
    var bibItem = this.props.doc.get(bibItemId);
    return bibItem.label;
  };

  this.renderSearchResult = function() {
    var searchResultEl = $$('div').addClass('se-search-results');

    _.each(this.state.searchResult.items, function(entry) {
      // TODO: usually we don't have a label
      // but when the bib-entry is referenced already
      var label = this.getLabel(entry.data.DOI) || '-';
      // Check if item is already in bibliography
      // var added = this.getBibItemIdByGuid(entry.data.DOI);
      var text = entry.text;
      var isAdded = this.isAdded(entry);

      searchResultEl.append($$(BibItemComponent, {
        node: {
          id: entry.data.DOI,
          label: label,
          text: text
        },
        toggleName: this.i18n.t(isAdded ? 'Remove' : 'Add'),
        highlighted: isAdded
      }));
    }, this);
    return searchResultEl;
  };

  this.onKeyPress = function(e) {
    if (e.which == 13 /* ENTER */) {
      this.startSearch();
    }
  };

  this.getBibItemIdByGuid = function(guid) {
    var doc = this.props.doc;
    return Object.keys(doc.bibItemByGuidIndex.get(guid))[0];
  };

  this.toggleItem = function(itemGuid) {
    if (this.getBibItemIdByGuid(itemGuid)) {
      this.removeItem(itemGuid);
    } else {
      this.addItem(itemGuid);
    }
  };

  this.getItem = function(itemGuid) {
    return _.find(this.state.searchResult.items, function(item) {
      return item.data.DOI === itemGuid;
    });
  };

  this.addItem = function(itemGuid) {
    var bibEntry = this.getItem(itemGuid);
    var doc = this.props.doc;
    doc.transaction({}, {}, function(tx) {
      var bibItem = {
        id: uuid('bib'),
        type: "bib-item",
        source: JSON.stringify(bibEntry.data),
        format: 'citeproc'
      };
      tx.create(bibItem);
    });
    this.rerender();
  };

  this.removeItem = function(itemGuid) {
    var nodeId = this.getBibItemIdByGuid(itemGuid);
    this.props.doc.transaction({}, {}, function(tx) {
      tx.delete(nodeId);
    });
    this.rerender();
  };

  this.startSearch = function() {
    var searchStr = this.refs.searchStr.val();

    var self = this;
    var doc = this.props.doc;

    var citeprocCompiler = doc.getCiteprocCompiler();
    var runningQueries = this.state.runningQueries;
    _.each(runningQueries, function(query) {
      query.reject();
    });
    runningQueries = [];
    _.each(this.context.bibSearchEngines, function(engine) {
      // the promise will deliver results on progress
      var promise = engine.find(searchStr);
      promise.progress(function(data) {
        self.state.searchResult.items.push({
          data: data,
          label: '',
          text: citeprocCompiler.renderReference(data)
        });
        self.rerender();
      });
      promise.done(function() {
        var idx = runningQueries.indexOf(promise);
        if (idx >= 0) {
          runningQueries.splice(idx, 1);
        }
      });
      // keep the promise so that we can abort it
      runningQueries.push(promise);
    });
    var searchResult = this.state.searchResult;
    searchResult.searchStr = searchStr;
    searchResult.items = [];
    this.setState({ searchResult: searchResult, runningQueries: runningQueries });
  };
};

Component.extend(AddBibItemsPanel);
module.exports = AddBibItemsPanel;
