'use strict';

var Substance = require('substance');
var OO = Substance.OO;
var LensController = require('./lens_controller');
var components = require('./components');
var commands = require('./commands');

var ContextToggles = require('substance/ui/ContextToggles');
var ContentPanel = require("substance/ui/ContentPanel");
var StatusBar = require("substance/ui/StatusBar");

var ContentToolbar = require('./components/content_toolbar');
var docHelpers = require('substance/document/helpers');
var Component = require('substance/ui/component');
var $$ = Component.$$;

function LensWriter(parent, params) {
  LensController.call(this, parent, params);
}

LensWriter.Prototype = function() {

  this.static = {
    config: {
      controller: {
        commands: commands.controller,
        components: components,
      },
      main: {
        commands: commands.main,
      },
      cover: {
        commands: commands.cover
      },
      panelOrder: ['toc', 'manageBibItems'],
      containerId: 'main'      
    }
  };

  this.render = function() {
    var doc = this.props.doc;
    var config = this.getConfig();
    var el = $$('div').addClass('lc-writer sc-controller');

    // Basic 2-column layout
    // -------------

    el.append(
      $$('div')/*.ref('workspace')*/.addClass('le-workspace').append(
        // Main (left column)
        $$('div').ref('main').addClass("le-main").append(
          $$(ContentToolbar).ref('toolbar'),
          $$(ContentPanel, {
            doc: doc,
            containerId: config.containerId
          }).ref('content')
        ),
        // Resource (right column)
        $$('div').ref('resource')
          .addClass("le-resource")
          .append(
            $$(ContextToggles, {
              panelOrder: config.panelOrder,
              contextId: this.state.contextId
            }).ref("context-toggles"),
            this.renderContextPanel()
          )
      )
    );
    // Status bar
    el.append(
      $$(StatusBar, {doc: doc}).ref('statusBar')
    );
    return el;
  };

  this.onSelectionChanged = function(sel, surface) {
    function getActiveAnno(type) {
      return docHelpers.getAnnotationsForSelection(doc, sel, type, 'main')[0];
    }

    if (surface.name !== "main") return;
    if (sel.isNull() || !sel.isPropertySelection()) {
      return;
    }
    if (sel.equals(this.prevSelection)) {
      return;
    }
    this.prevSelection = sel;
    var doc = surface.getDocument();
    var citation = getActiveAnno('citation');

    if (citation && citation.getSelection().equals(sel)) {
      // Trigger state change
      var citationType = citation.type.replace('_citation', '');
      this.setState({
        contextId: "cite_"+citationType,
        citationType: citationType,
        citationId: citation.id
      });
    } else {
      if (this.state.contextId !== 'toc') {
        this.setState({
          contextId: "toc"
        });
      }
    }
  };
};

OO.inherit(LensWriter, LensController);

module.exports = LensWriter;
