'use strict';

var SurfaceCommand = require('substance/ui/SurfaceCommand');
var insertInlineNode = require('substance/model/transform/insertInlineNode');
var extend = require('lodash/object/extend');

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
    var surface = this.getSurface();
    var newAnno;

    // Return if command is disabled
    if (state.disabled) return;

    surface.transaction(function(tx, args) {
      args.containerId = surface.getContainerId();
      args.node = extend({
        type: this.getAnnotationType()
      }, this.getAnnotationData());

      args = insertInlineNode(tx, args);
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
