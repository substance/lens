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

  constructor(parent, props) {
    super(parent, props);

    this.handleDeleteBibItem = this.handleDeleteBibItem.bind(this);
  }

  getInitialState() {
    var doc = this.props.doc;
    var bibliography = doc.getBibliography();
    bibliography.compile();
    return {
      bibItems: bibliography.getCompiledItems()
    };
  }

  render() {
    var el = $$('div', {classNames: 'content bib-items'});
    var bibItems = _.map(this.state.bibItems, function(entry) {
      return $$('div', { classNames: 'csl-entry clearfix border-bottom' },
        $$('div', { classNames: 'csl-left-margin' }, entry.label),
        $$('button', {
          "data-id": entry.id,
          classNames: 'button delete-button float-right small plain',
        }, "Delete"),
        $$('div', {classNames: 'csl-right-inline'}, entry.text)
      );
    }, this);
    return el.append(bibItems);
  }

  didMount() {
    this.$el.on('click', '.delete-button', this.handleDeleteBibItem);
  }

  willUnmount() {
    this.$el.off('click', '.delete-button', this.handleDeleteBibItem);
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

  constructor(parent, props) {
    super(parent, props);

    this.onClick = this.onClick.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  getInitialState() {
    return {
      searchResult: this.props.searchResult,
      runningQueries: [],
      addedItems: {}
    };
  }

  render() {
    return $$('div', {className: 'content'},
      $$('div', {className: 'toolbar tall border-bottom'},
        $$('input', {
          className: 'float-left', type: "text",
          placeholder: "Enter search term",
        }),
        $$('button', {className: 'button float-right'}, "Search")
      ),
      $$('div', {className: 'bib-items'},
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
      return $$('div', {classNames: 'csl-entry clearfix border-bottom'},
        $$('div', {classNames: 'csl-left-margin'}, label),
        $$('button', {
          classNames: 'button toggle-reference float-right small' +(added ? " plain" : " loud"),
          "data-id": entry.data.DOI
        }, /* $$(Icon, {icon: 'fa-trash-o'})*/ added ? "Remove" : "Add"),
        $$('div', {classNames: 'csl-right-inline'}, text)
      );
    }, this);
  }

  didMount() {
    // push surface selection state so that we can recover it when closing
    this.context.surfaceManager.pushState();
    var $input = this.$el.find('input');
    $input.val(this.state.searchResult.searchStr).focus();
    this.$el.on('click', 'button.toggle-reference', this.onClick);
    this.$el.on('keypress', 'input', this.onKeyPress);
  }

  willUnmount() {
    this.$el.off('click', 'button.toggle-reference', this.onClick);
    this.$el.off('keypress', 'input', this.onKeyPress);
    this.context.surfaceManager.popState();
  }

  onClick(e) {
    e.preventDefault();
    var itemGuid = e.currentTarget.dataset.id;
    this.toggleItem(itemGuid);
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

  onKeyPress(e) {
    if (e.which == 13 /* ENTER */) {
      this.startSearch($(e.currentTarget).val());
    }
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

  constructor(parent, props) {
    super(parent, props);

    this.handleContextSwitch = this.handleContextSwitch.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

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
      var classNames = ['pill'];
      if (context.contextId === state.contextId) classNames.push('active');
      return $$('button', {
          "data-id": context.contextId,
          classNames: classNames.join(' ')
        },
        $$(Icon, { icon: context.icon }),
        " "+context.label
      );
    }.bind(this));

    return $$('div', null,
      $$('div', {classNames: 'header toolbar clearfix menubar fill-light'},
        $$('div', {classNames: 'title float-left large'}, "References"),
        $$('div', {classNames: 'menu-group small'}, navItems),
        $$('button', { classNames: 'button close-modal float-right' },
          $$(Icon, { icon: 'fa-close' })
        )
      ),
      this.getContextElement()
    );
  }

  didMount() {
    this.$el.on('click', '.pill', this.handleContextSwitch);
    this.$el.on('click', '.close-modal', this.handleCloseModal);
  }

  willUnmount() {
    this.$el.off('click', '.pill', this.handleContextSwitch);
    this.$el.off('click', '.close-modal', this.handleCloseModal);
  }

  handleContextSwitch(e) {
    e.preventDefault();
    var contextId = e.currentTarget.dataset.id;
    this.setState({contextId: contextId});
  }

  getContextElement() {
    if (this.state.contextId === "list") {
      return $$(ListBibItems, {
        doc: this.props.doc
      });
    } else {
      return $$(AddBibItems, {
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
