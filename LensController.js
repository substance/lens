'use strict';

var extend = require('lodash/object/extend');
var $ = require('substance/util/jquery');
var TwoPanelController = require('substance/ui/TwoPanelController');
var CrossrefSearch = require('./packages/bibliography/CrossrefSearch');
var CiteprocCompiler = require('./packages/bibliography/CiteprocCompiler');

var I18n = require('substance/ui/i18n');
I18n.instance.load(require('./i18n/en'));

function LensController() {
  LensController.super.apply(this, arguments);

  this.handleActions({
    'toggleBibItem': this.toggleBibItem,
  });
}

LensController.Prototype = function() {

  var _super = Object.getPrototypeOf(this);

  this.getContentPanel = function() {
    return this.refs.contentPanel;
  };

  this.didMount = function() {
    _super.didMount.call(this);
    var doc = this.props.documentSession.getDocument();
    doc.citeprocCompiler = new CiteprocCompiler();
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
    var childContext = _super.getChildContext.call(this);
    return extend(childContext, {
      bibSearchEngines: [new CrossrefSearch()],
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


  // Action handlers
  // ---------------


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
      this.contentHighlights.set({
        'bib-item': bibItemHighlights,
        'figure': figureHighlights
      });
    }.bind(this), 0);
  };
};

TwoPanelController.extend(LensController);

module.exports = LensController;
