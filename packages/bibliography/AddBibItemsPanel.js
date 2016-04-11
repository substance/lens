'use strict';

var _ = require('substance/util/helpers');
var Component = require('substance/ui/Component');
var BibItemComponent = require('./BibItemComponent');
var DialogHeader = require('substance/ui/DialogHeader');
var ScrollPane = require('substance/ui/ScrollPane');

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

  this.getInitialState = function() {
    return {
      searchResult: {
        searchStr: '',
        items: []
      },
      runningQueries: []
    };
  };

  this.didMount = function() {
    // push surface selection state so that we can recover it when closing
    var $input = this.$el.find('input');
    $input.val(this.state.searchResult.searchStr).focus();
  };

  this.render = function($$) {
    return $$('div').addClass('sc-add-bib-items-panel').append(
      $$(DialogHeader, {
        label: this.i18n.t('add-bib-entries'),
        exitContext: 'bib-items'
      }),
      $$(ScrollPane).ref('scrollPane').append(
        $$('div').addClass('se-search-form').append(
          $$('input')
            .attr({
              type: "text",
              placeholder: this.i18n.t('enter_search_term'),
              value: this.state.searchResult.searchStr
            })
            .ref('searchStr')
            .on('keypress', this.onKeyPress.bind(this)),
          $$('button').addClass('button float-right')
            .append("Search")
            .on('click', this.startSearch.bind(this))
        ),
        this.renderSearchResult($$)
      )
    );
  };

  this.toggleBibItem = function(bibItem) {
    this.toggleItem(bibItem.id);
  };

  this.handleCancel = function(e) {
    e.preventDefault();
    this.send('switchContext', 'bib-items');
  };

  this.isAdded = function(entry) {
    return !!this.props.doc.get(entry.data.DOI);
  };

  // Get label for bib item if already added
  this.getLabel = function(doi) {
    var label = '';
    if (doi) {
      var bibItem = this.props.doc.get(doi);
      if (bibItem && bibItem.label) label = bibItem.label;
    }
    return label;
  };

  this.renderSearchResult = function($$) {
    var searchResultEl = $$('div').addClass('se-search-results');
    var items = this.state.searchResult.items;

    _.each(items, function(entry) {
      // TODO: usually we don't have a label
      // but when the bib-entry is referenced already
      var label = this.getLabel(entry.data.DOI);
      // Check if item is already in bibliography
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

  this.toggleItem = function(itemGuid) {
    var doc = this.props.doc;

    if (doc.get(itemGuid)) {
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
        id: bibEntry.data.DOI,
        type: "bib-item",
        data: bibEntry.data,
        format: 'citeproc'
      };
      tx.create(bibItem);
    });
    this.rerender();
  };

  this.removeItem = function(nodeId) {
    this.props.doc.transaction({}, {}, function(tx) {
      tx.delete(nodeId);
    });
    this.rerender();
  };

  this.startSearch = function() {
    var searchStr;

    // Make this robust for now until we have a fix for owner-based refs
    if (this.refs.searchStr) {
      searchStr = this.refs.scrollPane.val();
    } else {
      searchStr = this.refs.scrollPane.refs.searchStr.val();
    }

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
