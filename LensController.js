'use strict';

var Substance = require('substance');
var _ = require('substance/basics/helpers');

var OO = Substance.OO;
var Controller = require("substance/ui/Controller");
var CrossrefSearch = require('./packages/bibliography/CrossrefSearch');
var Component = require('substance/ui/component');
var $$ = Component.$$;
var $ = require('substance/basics/jquery');

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

  this.handleApplicationKeyCombos = this.handleApplicationKeyCombos.bind(this);

  // action handlers
  this.actions({
    "switchState": this.switchState,
    "switchContext": this.switchContext
  });
}

LensController.Prototype = function() {


  // Some things should go into controller
  this.getChildContext = function() {
    var childContext = Controller.prototype.getChildContext.call(this);

    return _.extend(childContext, {
      bibSearchEngines: [new CrossrefSearch()],
      i18n: I18n.instance,
      // Used for turning embed urls to HTML content
      embedResolver: function(srcUrl, cb) {
        $.get('http://iframe.ly/api/iframely?url='+encodeURIComponent(srcUrl)+'&api_key=712fe98e864c79e054e2da')
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

  // Pass writer start
  this._panelPropsFromState = function (state) {
    var props = _.omit(state, 'contextId');
    props.doc = this.props.doc;
    return props;
  };

  this.getActivePanelElement = function() {
    var ComponentClass = this.componentRegistry.get(this.state.contextId);
    if (ComponentClass) {
      return $$(ComponentClass).setProps(this._panelPropsFromState(this.state));
    } else {
      console.warn("Could not find component for contextId:", this.state.contextId);
    }
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

  this.renderContextPanel = function() {
    var panelElement = this.getActivePanelElement();
    if (!panelElement) {
      return $$('div').append("No panels are registered");
    } else {
      return $$('div').ref('context-panel').append(panelElement);
    }
  };


  // Hande Writer state change updates
  // --------------
  //
  // Here we update highlights

  this.handleStateUpdate = function(newState) {
    // var oldState = this.state;
    var doc = this.getDocument();

    function getActiveNodes(state) {
      if (state.citationId) {
        // TODO: targets only works for figures
        // However if we click on a bib ref [1-4]
        // it would maybe be useful to show all citations that
        // reference 1,2,3, or 4.
        var targets = doc.get(state.citationId).targets;
        return [ state.citationId ].concat(targets);
      }
      return [];
    }

    var activeAnnos = getActiveNodes(newState);
    // HACK: updates the highlights when state
    // transition has finished
    setTimeout(function() {
      doc.setHighlights(activeAnnos);  
    }, 0);
  };
};

OO.inherit(LensController, Controller);

module.exports = LensController;