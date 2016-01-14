'use strict';

var SurfaceCommand = require('substance/ui/SurfaceCommand');
var createAnnotation = require('substance/model/transform/createAnnotation');
var insertText = require('substance/model/transform/insertText');

function CitationCommand() {
  CitationCommand.super.apply(this, arguments);
}

CitationCommand.Prototype = function() {

  this.getCommandState = function() {
    var sel = this.getSelection();
    var newState = {
      disabled: true,
      active: false
    };

    if (sel && !sel.isNull() && sel.isPropertySelection()) {
      newState.disabled = false;
    }
    return newState;
  };

  this.getAnnotationData = function() {
    return {
      targets: []
    };
  };

  this.getAnnotationType = function() {
    if (this.constructor.static.annotationType) {
      return this.constructor.static.annotationType;
    } else {
      throw new Error('Contract: CitationCommand.static.annotationType should be associated to a document citation type.');
    }
  };

  this.execute = function() {
    var state = this.getCommandState();
    var doc = this.getDocument();
    var surface = this.getSurface();
    var newAnno;

    // Return if command is disabled
    if (state.disabled) return;

    surface.transaction(function(tx, args) {

      // 1. Insert fake character where the citation should stick on
      args = insertText(tx, {
        selection: args.selection,
        text: '$'
      });

      var citationSel = doc.createSelection({
        type: 'property',
        path: args.selection.path,
        startOffset: args.selection.startOffset-1,
        endOffset: args.selection.endOffset
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
  };

};

SurfaceCommand.extend(CitationCommand);

module.exports = CitationCommand;
