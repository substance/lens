'use strict';

var Substance = require('substance');
var OO = Substance.OO;
var Writer = require("substance/ui/writer");
var components = require('./components');
var commands = require('./commands');
var stateHandlers = require('./state_handlers');

var ContextToggles = require('substance/ui/writer/context_toggles');
var ContentPanel = require("substance/ui/writer/content_panel");
var StatusBar = require("substance/ui/writer/status_bar");
// var ModalPanel = require('substance/ui/writer/modal_panel');
var ContentToolbar = require('./components/content_toolbar');

var CrossrefSearch = require('../lib/article/bib/crossref_search');

var docHelpers = require('substance/document/helpers');

var Component = require('substance/ui/component');
var $$ = Component.$$;

function LensWriter(parent, params) {
  params.props.config = {
    panelOrder: ['toc'],
    containerId: 'main',
    components: components,
    commands: commands,
    stateHandlers: stateHandlers
  };
  Writer.call(this, parent, params);
}

LensWriter.Prototype = function() {

  this.getChildContext = function() {
    return {
      controller: this.controller,
      componentRegistry: this.controller.componentRegistry,
      bibSearchEngines: [new CrossrefSearch()]
    };
  };

  this.getInitialState = function() {
    return {'contextId': 'toc'};
  };

  this.render = function() {
    var doc = this.props.doc;
    var el = $$('div').addClass('writer-component');

    // Basic 2-column layout
    // -------------

    // Main container (where the main doc goes)
    el.append(
      $$('div').ref('mainContainer').addClass("main-container").append(
        $$(ContentToolbar).ref('toolbar'),
        $$(ContentPanel, {
          doc: doc,
          containerId: this.config.containerId
        }).ref('content')
      )
    );

    // Resource container
    el.append(
      $$('div').ref('resource-container')
        .addClass("resource-container")
        .append(
          $$(ContextToggles, {panelOrder: this.config.panelOrder}).ref("context-toggles"),
          this.renderContextPanel()
        )
    );

    // Status bar
    el.append(
      $$(StatusBar).ref('statusBar').setProps({ doc: doc })
    );
    // Clipboard
    el.append(
      $$('div').ref('clipboard').addClass("clipboard")
    );
    return el;
  };

  this.renderContextPanel = function() {
    var panelElement = this.getActivePanelElement();
    if (!panelElement) {
      return $$('div').append("No panels are registered");
    } else {
      return $$('div').ref('context-panel').append(panelElement);
    }
  };

  // this.onCommandExecuted = function(info, commandName) {
  //   if (commandName === 'toggleComment' && info.mode === 'create') {
  //     this.setState({
  //       contextId: 'editComment'
  //     })
  //   } else if (commandName === 'toggleTopicCitation' && info.mode === 'create') {
  //     this.setState({
  //       contextId: 'editTopicCitation'
  //     })
  //   }
  // };


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

  // this.onSelectionChanged = function(sel, surface) {
  //   var contentContainer = surface.getContainer();
  //   var doc = this.getDocument();

  //   if (sel.isNull() || !sel.isPropertySelection() || !sel.isCollapsed()) return false;
  //   if (surface.getContainerId() !== "body") return false;

  //   // From topics panel
  //   // ---------------
  //   //


  //   function activeAnno(type) {
  //     return helpers.getAnnotationsForSelection(doc, sel, type, "body")[0]; 
  //   }

  //   var topicCitation = activeAnno("topic_citation");
  //   var comment = activeAnno("comment");

  //   if (topicCitation) {
  //     // Trigger state change
  //     this.setState({
  //       contextId: "editTopicCitation",
  //       topicCitationId: topicCitation.id,
  //       noScroll: true
  //     });
  //     return true;
  //   } else if (comment) {
  //     this.setState({
  //       contextId: "editComment",
  //       commentId: comment.id,
  //       noScroll: true
  //     });
  //     return true;
  //   } else {
  //     if (this.state.contextId !== 'toc') {
  //       this.setState({
  //         contextId: "toc"
  //       });
  //     }
  //     return true;
  //   }
  // };

  // Hande Writer state change updates
  // --------------
  // 
  // Here we update highlights

  // this.handleStateUpdate = function(newState) {
  //   var oldState = this.state;
  //   var doc = this.getDocument();

  //   function getActiveNodes(state) {
  //     if (state.topicCitationId) {
  //       return [ state.topicCitationId ];
  //     } else if (state.commentId) {
  //       return [ state.commentId ];
  //     }
  //     return [];
  //   }

  //   var activeAnnos = getActiveNodes(newState);
  //   doc.setHighlights(activeAnnos);
  // }

};

OO.inherit(LensWriter, Writer);

module.exports = LensWriter;
