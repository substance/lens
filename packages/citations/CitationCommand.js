'use strict';

var SurfaceCommand = require('substance/ui/SurfaceCommand');
var createAnnotation = require('substance/model/transform/createAnnotation');
var insertText = require('substance/model/transform/insertText');

var CitationCommand = SurfaceCommand.extend({

  getCommandState: function() {
    var sel = this.getSelection();
    var newState = {
      disabled: true,
      active: false
    };

    if (sel && !sel.isNull() && sel.isPropertySelection() && sel.isCollapsed()) {
      newState.disabled = false;
    }
    return newState;
  },

  getAnnotationData: function() {
    return {
      targets: []
    };
  },

  getAnnotationType: function() {
    if (this.constructor.static.annotationType) {
      return this.constructor.static.annotationType;
    } else {
      throw new Error('Contract: CitationCommand.static.annotationType should be associated to a document citation type.');
    }
  },

  execute: function() {
    var state = this.getCommandState();
    var doc = this.getDocument();
    var surface = this.getSurface();
    var newAnno;
    
    // Return if command is disabled
    if (state.disabled) return;

    surface.transaction(function(tx, args) {
      var collapsedSel = surface.getSelection();

      // 1. Insert fake character where the citation should stick on
      args = insertText(tx, {
        selection: collapsedSel,
        text: '$'
      });

      var citationSel = doc.createSelection({
        type: 'property',
        path: collapsedSel.path,
        startOffset: collapsedSel.startOffset-1,
        endOffset: collapsedSel.endOffset
      });

      // 2. Create citation annotation
      args.annotationType = this.getAnnotationType();
      args.annotationData = this.getAnnotationData();
      args.selection = citationSel;
      args.splitContainerSelections = false;
      args.containerId = surface.getContainerId();

      args = createAnnotation(tx, args);
      newAnno = args.result;
      return args;
    }.bind(this));

    return {
      mode: 'create',
      anno: newAnno
    };
  }

});

module.exports = CitationCommand;