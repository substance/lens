'use strict';

var _ = require("substance/helpers");
var Component = require('substance/ui/component');
var Icon = require("substance/ui/font_awesome_icon");
var $$ = Component.$$;
var uuid = require('substance/basics/uuid');

var CONTEXTS = [
  {contextId: 'list', label: 'Manage', icon: 'fa-list'},
  {contextId: 'add', label: 'Add references', icon: 'fa-plus'},
];

// List existing bib items
// -----------------

class ListBibItems extends Component {

  getInitialState() {
    var doc = this.props.doc;
    var bibliography = doc.getBibliography();
    bibliography.compile();
    return {
      bibItems: bibliography.getCompiledItems()
    };
  }

  render() {
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
          .append("Delete"),
        $$('div')
          .addClass('csl-right-inline')
          .append(entry.text)
      );
    }, this);
    return el.append(bibItems);
  }

  handleDeleteBibItem(e) {
    e.preventDefault();
    var bibItemId = e.currentTarget.dataset.id;
    var doc = this.context.app.doc;

    doc.deleteBibItem(bibItemId);
    var bibliography = doc.getBibliography();
    // Recompile bibliography
    bibliography.compile();
    var bibItems = bibliography.getCompiledItems();
    this.setState({
      bibItems: bibItems
    });
  }
}

// Create new bib items using cross ref search
// -----------------

class AddBibItems extends Component {

  getInitialState() {
    return {
      searchResult: this.props.searchResult,
      runningQueries: [],
      addedItems: {}
    };
  }

  render() {
    return $$('div').addClass('content').append(
      $$('div').addClass('toolbar tall border-bottom').append(
        $$('input').addClass('float-left')
          .attr({
            type: "text",
            placeholder: "Enter search term",
          })
          .on('keypress', this.onKeyPress),
        $$('button').addClass('button float-right')
          .append("Search")
      ),
      $$('div').addClass('bib-items').append(
        this.renderBibItems()
      )
    );
  }

  renderBibItems() {
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
  }

  didMount() {
    // push surface selection state so that we can recover it when closing
    this.context.surfaceManager.pushState();
    var $input = this.$el.find('input');
    $input.val(this.state.searchResult.searchStr).focus();
  }

  willUnmount() {
    this.context.surfaceManager.popState();
  }

  onClick(e) {
    e.preventDefault();
    var itemGuid = e.currentTarget.dataset.id;
    this.toggleItem(itemGuid);
  }

  onKeyPress(e) {
    if (e.which == 13 /* ENTER */) {
      this.startSearch($(e.currentTarget).val());
    }
  }

  getBibItemIdByGuid(guid) {
    var doc = this.props.doc;
    return Object.keys(doc.bibItemByGuidIndex.get(guid))[0];
  }

  toggleItem(itemGuid) {
    if (this.getBibItemIdByGuid(itemGuid)) {
      this.removeItem(itemGuid);
    } else {
      this.addItem(itemGuid);
    }
  }

  getItem(itemGuid) {
    return _.find(this.state.searchResult.items, function(item) {
      return item.data.DOI === itemGuid;
    });
  }

  addItem(itemGuid) {
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
  }

  removeItem(itemGuid) {
    var nodeId = this.getBibItemIdByGuid(itemGuid);
    this.props.doc.transaction({}, {}, function(tx) {
      tx.delete(nodeId);
    });
    this.rerender();
  }

  startSearch(searchStr) {
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
  }

}

class ManageBibItemsPanel extends Component {

  getInitialState() {
    return {
      contextId: 'list',
      searchResult: {
        query: '',
        items: []
      }
    };
  }

  render() {
    var state = this.state;
    var navItems = _.map(CONTEXTS, function(context) {
      var button = $$('button').addClass('pill')
        .attr("data-id", context.contextId)
        .on('click', this.handleContextSwitch)
        .append($$(Icon).addProps({ icon: context.icon })
          .append(" "+context.label)
        );
      if (context.contextId === state.contextId) {
        button.addClass('active');
      }
      return button;
    }.bind(this));

    return $$('div').append(
      $$('div').addClass('header toolbar clearfix menubar fill-light').append(
        $$('div').addClass('title float-left large').append("References"),
        $$('div').addClass('menu-group small').append(navItems),
        $$('button').addClass('button close-modal float-right').append(
          $$(Icon).addProps({ icon: 'fa-close' })
        ).on('click', this.handleCloseModal)
      ),
      this.getContextElement()
    );
  }

  handleContextSwitch(e) {
    e.preventDefault();
    var contextId = e.currentTarget.dataset.id;
    this.setState({contextId: contextId});
  }

  getContextElement() {
    if (this.state.contextId === "list") {
      return $$(ListBibItems).addProps({
        doc: this.props.doc
      });
    } else {
      return $$(AddBibItems).addProps({
        doc: this.props.doc,
        searchResult: this.state.searchResult
      });
    }
  }
}

// Panel Configuration
// -----------------

ManageBibItemsPanel.contextId = "manageBibItems";
ManageBibItemsPanel.icon = "fa-align-left";

module.exports = ManageBibItemsPanel;
