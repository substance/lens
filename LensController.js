'use strict';

var _ = require('substance/util/helpers');

var omit = require('lodash/object/omit');
var Controller = require("substance/ui/Controller");
var CrossrefSearch = require('./packages/bibliography/CrossrefSearch');
var $ = require('substance/util/jquery');
var TOC = require('substance/ui/TOC');

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
  this.handleApplicationKeyCombos = this.handleApplicationKeyCombos.bind(this);

  // action handlers
  this.handleActions({
    'switchState': this.switchState,
    'switchContext': this.switchContext,
    'toggleBibItem': this.toggleBibItem,
    'tocEntrySelected': this.tocEntrySelected
  });
}

LensController.Prototype = function() {

  // HACK: For some reasons this.refs.contentPanel disappears after 2nd state update
  // so we work around by caching this.refs.contentPanel.refs.scrollPane
  this.didMount = function() {
    if (!this.contentPanel && this.refs.contentPanel) {
      this.contentPanel = this.refs.contentPanel;
      this.contentPanelScrollPane = this.contentPanel.refs.scrollPane;
    }

    if (this.state.nodeId && this.state.contextId === 'toc') {
      this.contentPanelScrollPane.scrollTo(this.state.nodeId);
    }
  };

  this.didUpdateState = function() {
    if (this.state.nodeId && this.state.contextId === 'toc') {
      this.contentPanelScrollPane.scrollTo(this.state.nodeId);
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

  // handles 'switch-state'
  this.switchState = function(newState, options) {
    options = options || {};
    this.setState(newState);
    if (options.restoreSelection) {
      this.restoreSelection();
    }
  };

  // handles 'switch-context'
  this.switchContext = function(contextId, options) {
    options = options || {};
    this.setState({ contextId: contextId });
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
      if (!this.contentPanel) {
        this.contentPanel = this.refs.contentPanel;  
      }
      this.contentPanel.setHighlights({
        'bib-item': bibItemHighlights,
        'figure': figureHighlights
      });
    }.bind(this), 0);
  };
};

Controller.extend(LensController);

module.exports = LensController;