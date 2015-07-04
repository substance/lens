var Substance = require("substance");
var _ = require("substance/helpers");
var $$ = React.createElement;

var Icon = require("substance-ui/font_awesome_icon");

var CONTEXTS = [
  {contextId: 'list', label: 'Manage', icon: 'fa-list'},
  {contextId: 'add', label: 'Add references', icon: 'fa-plus'},
];

// List existing bib items
// -----------------

var ListBibItems = React.createClass({

  contextTypes: {
    app: React.PropTypes.object.isRequired,
  },

  handleDeleteBibItem: function(e) {
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
  },

  getInitialState: function() {
    var doc = this.props.doc;

    var bibliography = doc.getBibliography();
    bibliography.compile();

    return {
      bibItems: bibliography.getCompiledItems()
    };
  },

  render: function() {
    var doc = this.props.doc;
    var bibItems = _.map(this.state.bibItems, function(entry) {
      return $$('div', {className: 'csl-entry clearfix border-bottom'},
        $$('div', {className: 'csl-left-margin'}, entry.label),
        $$('button', {
          "data-id": entry.id,
          className: 'button float-right small plain',
          onClick: this.handleDeleteBibItem
        }, "Delete"),
        $$('div', {className: 'csl-right-inline'}, entry.text)
      );
    }, this);
    return $$('div', {className: 'content bib-items'}, bibItems);
  }
});



// Create new bib items using cross ref search
// -----------------

var AddBibItems = React.createClass({

  contextTypes: {
    app: React.PropTypes.object.isRequired,
    bibSearchEngines: React.PropTypes.object.isRequired,
    surfaceManager: React.PropTypes.object.isRequired,
  },

  componentDidMount: function() {
    // push surface selection state so that we can recover it when closing
    this.context.surfaceManager.pushState();

    var $input = $(React.findDOMNode(this)).find('input');
    $input.val(this.state.searchResult.searchStr).focus();
  },

  componentWillUnmount: function() {
    this.context.surfaceManager.popState();
  },

  getInitialState: function() {
    return {
      searchResult: this.props.searchResult,
      runningQueries: [],
      addedItems: {}
    };
  },

  onClick: function(e) {
    e.preventDefault();
    var itemGuid = e.currentTarget.dataset.id;
    this.toggleItem(itemGuid);
  },

  getBibItemIdByGuid: function(guid) {
    return Object.keys(doc.bibItemByGuidIndex.get(guid))[0];
  },

  toggleItem: function(itemGuid) {
    if (this.getBibItemIdByGuid(itemGuid)) {
      this.removeItem(itemGuid);
    } else {
      this.addItem(itemGuid);
    }
  },

  getItem: function(itemGuid) {
    return _.find(this.state.searchResult.items, function(item) {
      return item.data.DOI === itemGuid;
    });
  },

  addItem: function(itemGuid) {
    var addedItems = this.state.addedItems;
    var app = this.context.app;
    var bibEntry = this.getItem(itemGuid);

    doc.transaction({}, {}, function(tx, args) {
      var bibItem = {
        id: Substance.uuid('bib'),
        type: "bib_item",
        source: JSON.stringify(bibEntry.data),
        format: 'citeproc'
      };

      tx.create(bibItem);
    });

    this.forceUpdate();
  },

  removeItem: function(itemGuid) {
    var addedItems = this.state.addedItems;
    var app = this.context.app;
    var sel = app.getSelection();
    var nodeId = this.getBibItemIdByGuid(itemGuid);

    doc.transaction({}, {}, function(tx, args) {
      tx.delete(nodeId);
    });
    this.forceUpdate();
  },

  render: function() {
    var doc = this.props.doc;
    var citeprocCompiler = doc.getCiteprocCompiler();
    var bibItems = _.map(this.state.searchResult.items, function(entry) {
      // TODO: usually we don't have a label
      // but when the bib-entry is referenced already
      var label = entry.label;

      // Check if item is already in bibliography
      var added = this.getBibItemIdByGuid(entry.data.DOI);

      var text = entry.text;

      return $$('div', {className: 'csl-entry clearfix border-bottom'},
        $$('div', {className: 'csl-left-margin'}, label),
        $$('button', {"data-id": entry.data.DOI, className: 'button float-right small' +(added ? " plain" : " loud"), onClick: this.onClick }, /* $$(Icon, {icon: 'fa-trash-o'})*/ added ? "Remove" : "Add"),
        $$('div', {className: 'csl-right-inline'}, text)
      );
    }, this);

    return $$('div', {className: 'content'},
      $$('div', {className: 'toolbar tall border-bottom'},
        $$('input', {
            className: 'float-left', type: "text",
            placeholder: "Enter search term",
            onKeyPress: this.onKeyPress
          }),
        $$('button', {className: 'button float-right'}, "Search")
      ),
      $$('div', {className: 'bib-items'}, bibItems)
    );
  },

  onKeyPress: function(e) {
    if (e.which == 13 /* ENTER */) {
      this.startSearch($(e.currentTarget).val());
    }
  },

  startSearch: function(searchStr) {
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
});


var ManageBibItemsPanel = React.createClass({
  displayName: "ManageBibItemsPanel",

  getInitialState: function() {
    return {
      contextId: 'list',
      searchResult: {
        query: '',
        items: []
      }
    };
  },

  handleContextSwitch: function(e) {
    e.preventDefault();
    var contextId = e.currentTarget.dataset.id;
    this.setState({contextId: contextId});
  },

  getContextElement: function() {

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
  },

  render: function() {
    var doc = this.props.doc;
    var citeprocCompiler = doc.getCiteprocCompiler();
    var bibliography = doc.getBibliography();

    var state = this.state;
    var navItems = _.map(CONTEXTS, function(context) {
      var classNames = ['pill'];
      if (context.contextId === state.contextId) classNames.push('active');
      return $$('button', {
        "data-id": context.contextId,
        className: classNames.join(' '),
        onClick: this.handleContextSwitch,
      }, $$(Icon, {icon: context.icon}), " "+context.label);
    }.bind(this));

    return $$('div', null,
      $$('div', {className: 'header toolbar clearfix menubar fill-light'},
        $$('div', {className: 'title float-left large'}, "References"),
        $$('div', {className: 'menu-group small'}, navItems),
        $$('button', {className: 'button close-modal float-right', onClick: this.handleCloseModal}, $$(Icon, {icon: 'fa-close'}))
      ),
      this.getContextElement()
    );
  }
});

// Panel Configuration
// -----------------

ManageBibItemsPanel.contextId = "manageBibItems";
ManageBibItemsPanel.icon = "fa-align-left";

module.exports = ManageBibItemsPanel;