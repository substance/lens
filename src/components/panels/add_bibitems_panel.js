'use strict';

var Substance = require('substance');
var _ = Substance._;
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;
var uuid = Substance.uuid;

// Create new bib items using cross ref search
// -----------------

function AddBibItems() {
  Component.apply(this, arguments);
}

AddBibItems.Prototype = function() {

  this.getInitialState = function() {
    return {
      searchResult: this.props.searchResult,
      runningQueries: [],
      addedItems: {}
    };
  };

  this.render = function() {
    return $$('div').addClass('content').append(
      $$('div').addClass('toolbar tall border-bottom').append(
        $$('input').addClass('float-left')
          .attr({
            type: "text",
            placeholder: this.i18n.t('enter_search_term'),
          })
          .on('keypress', this.onKeyPress),
        $$('button').addClass('button float-right')
          .append("Search")
      ),
      $$('div').addClass('bib-items').append(
        this.renderBibItems()
      )
    );
  };

  this.renderBibItems = function() {
    return _.map(this.state.searchResult.items, function(entry) {
      // TODO: usually we don't have a label
      // but when the bib-entry is referenced already
      var label = entry.label;
      // Check if item is already in bibliography
      var added = this.getBibItemIdByGuid(entry.data.DOI);
      var text = entry.text;
      return $$('div').addClass('csl-entry clearfix border-bottom').append(
        $$('div').addClass('csl-left-margin')
          .append(label),
        $$('button').addClass('button toggle-reference float-right small' + (added ? " plain" : " loud"))
          .attr("data-id", entry.data.DOI)
          .on('click', this.onClick)
          .append(added ? "Remove" : "Add"),
        $$('div').addClass('csl-right-inline')
          .append(text)
      );
    }, this);
  };

  this.didMount = function() {
    // push surface selection state so that we can recover it when closing
    this.context.surfaceManager.pushState();
    var $input = this.$el.find('input');
    $input.val(this.state.searchResult.searchStr).focus();
  };

  this.willUnmount = function() {
    this.context.surfaceManager.popState();
  };

  this.onClick = function(e) {
    e.preventDefault();
    var itemGuid = e.currentTarget.dataset.id;
    this.toggleItem(itemGuid);
  };

  this.onKeyPress = function(e) {
    if (e.which == 13 /* ENTER */) {
      this.startSearch($(e.currentTarget).val());
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
        type: "bib_item",
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

  this.startSearch = function(searchStr) {
    console.log('Start search', searchStr);
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
        console.log('data', data);
        self.state.searchResult.items.push({
          data: data,
          label: '',
          text: citeprocCompiler.renderReference(data)
        });
        self.forceUpdate();
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
    var searchResult = this.props.searchResult;
    searchResult.searchStr = searchStr;
    searchResult.items = [];
    this.setState({ searchResult: searchResult, runningQueries: runningQueries });
  };
};

OO.inherit(AddBibItems, Component);

module.exports = AddBibItems;
