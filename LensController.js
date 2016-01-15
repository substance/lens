'use strict';

var _ = require('substance/util/helpers');
var omit = require('lodash/object/omit');
var Controller = require("substance/ui/Controller");
var Component = require('substance/ui/Component');
var $$ = Component.$$;
var CrossrefSearch = require('./packages/bibliography/CrossrefSearch');
var $ = require('substance/util/jquery');
var TOC = require('substance/ui/TOC');
var Highlights = require('substance/ui/Highlights');
var TabbedPane = require('substance/ui/TabbedPane');

// Substance is i18n ready, but by now we did not need it
// Thus, we configure I18n statically as opposed to loading
// language files for the current locale
var I18n = require('substance/ui/i18n');
I18n.instance.load(require('substance/i18n/en'));
I18n.instance.load(require('./i18n/en'));
// e.g. in german
// I18n.instance.load(require('substance/ui/i18n/de'));
// I18n.instance.load(require('./i18n/de'));

function LensController(parent, params) {
  Controller.call(this, parent, params);
  this.toc = new TOC(this);
  this.contentHighlights = new Highlights(this.getDocument());
  this.handleApplicationKeyCombos = this.handleApplicationKeyCombos.bind(this);

  // action handlers
  this.handleActions({
    'switchState': this.switchState,
    'switchTab': this.switchContext,
    'switchContext': this.switchContext,
    'toggleBibItem': this.toggleBibItem,
    'tocEntrySelected': this.tocEntrySelected,
    'closeDialog': this.closeDialog
  });
}

LensController.Prototype = function() {

  // Shows the TOC by default
  this.closeDialog = function() {
    this.setState({ contextId: 'toc' });
  };

  this.didMount = function() {
    if (this.state.nodeId && this.state.contextId === 'toc') {
      this.refs.contentPanel.scrollTo(this.state.nodeId);
    }
  };

  this.didUpdateState = function() {
    if (this.state.nodeId && this.state.contextId === 'toc') {
      this.refs.contentPanel.scrollTo(this.state.nodeId);
    }
  };

  this.tocEntrySelected = function(nodeId) {
    this.extendState({
      nodeId: nodeId
    });
  };

  // Extract props needed for panel parametrization
  this._panelPropsFromState = function() {
    var props = omit(this.state, 'contextId');
    props.doc = this.getDocument();
    return props;
  };

  // Used by two-column apps
  this._renderContextSection = function() {
    var config = this.getConfig();
    var panelProps = this._panelPropsFromState();
    var contextId = this.state.contextId;
    var panels = config.panels || {};
    var panelConfig = panels[this.state.contextId] || {};
    var tabOrder = config.tabOrder;
    var PanelComponentClass = this.componentRegistry.get(contextId);

    var tabs = tabOrder.map(function(contextId) {
      return {
        id: contextId,
        name: this.i18n.t(contextId)
      };
    }.bind(this));

    var el = $$('div').addClass('se-context-section').ref('contextSection');
    var panelEl = $$(PanelComponentClass, panelProps).ref(contextId);

    // Use full space if panel is configured as a dialog
    if (panelConfig.isDialog) {
      el.append(panelEl);
    } else {
      el.append(
        $$(TabbedPane, {
          activeTab: contextId,
          tabs: tabs,
        }).ref(this.state.contextId).append(
          panelEl
        )
      );
    }
    return el;
  };

  // Action used by BibItemComponent when clicked on focus
  this.toggleBibItem = function(bibItem) {
    if (this.state.bibItemId === bibItem.id) {
      this.setState({
        contextId: 'bib-items'
      });
    } else {
      this.setState({
        contextId: 'bib-items',
        bibItemId: bibItem.id
      });
    }
  };

  // Some things should go into controller
  this.getChildContext = function() {
    var childContext = Controller.prototype.getChildContext.call(this);
    return _.extend(childContext, {
      toc: this.toc,
      bibSearchEngines: [new CrossrefSearch()],
      i18n: I18n.instance,
      // Used for turning embed urls to HTML content
      embedResolver: function(srcUrl, cb) {
        $.get('http://iframe.ly/api/iframely?url='+encodeURIComponent(srcUrl)+'&api_key=712fe98e864c79e054e2da')
        // $.get('http://iframely.coko.foundation/iframely?url='+encodeURIComponent(srcUrl)+'')
          .success(function(res) {
            cb(null, res.html);
          })
          .error(function(err) {
            cb(err);
          });
      }
    });
  };

  this.getInitialState = function() {
    return {'contextId': 'toc'};
  };

  // Action handlers
  // ---------------

  // handles 'switchState'
  this.switchState = function(newState, options) {
    options = options || {};
    this.setState(newState);
    if (options.restoreSelection) {
      this.restoreSelection();
    }
  };

  // handles 'switchContext' and 'switchTab'
  this.switchContext = function(tabId, options) {
    options = options || {};
    this.setState({ contextId: tabId });
    if (options.restoreSelection) {
      this.restoreSelection();
    }
  };

  this.restoreSelection = function() {
    var surface = this.getSurface('body');
    surface.rerenderDomSelection();
  };

  this.uploadFile = function(file, cb) {
    // This is a testing implementation
    if (this.props.onUploadFile) {
      return this.props.onUploadFile(file, cb);
    } else {
      // Default file upload implementation
      // We just return a temporary objectUrl
      var fileUrl = window.URL.createObjectURL(file);
      cb(null, fileUrl);
    }
  };


  // Hande Writer state change updates
  // --------------
  //
  // Here we update highlights

  this.handleStateUpdate = function(newState) {
    var doc = this.getDocument();

    function getFigureHighlights(state) {
      if (state.citationId) {
        var citation = doc.get(state.citationId);
        if (citation && ['image-figure', 'table-figure'].indexOf(citation.getItemType()) >= 0) {
          return [ state.citationId ].concat(citation.targets);
        }
      }
      return [];
    }

    function getBibItemHighlights(state) {
      if (state.bibItemId) {
        // Get citations for a given target
        var citations = Object.keys(doc.citationsIndex.get(state.bibItemId));
        return citations;
      } else if (state.citationId) {
        var citation = doc.get(state.citationId);
        if (citation && citation.getItemType() === 'bib-item') {
          return [ state.citationId ].concat(citation.targets);
        }
      }
      return [];
    }

    var bibItemHighlights = getBibItemHighlights(newState);
    var figureHighlights = getFigureHighlights(newState);
    
    // HACK: updates the highlights when state
    // transition has finished    
    setTimeout(function() {
      this.contentHighlights.setHighlights({
        'bib-item': bibItemHighlights,
        'figure': figureHighlights
      });
    }.bind(this), 0);
  };
};

Controller.extend(LensController);

module.exports = LensController;