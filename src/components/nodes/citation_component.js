'use strict';

var Substance = require('substance');
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;

function CitationComponent() {
  Component.apply(this, arguments);
}

CitationComponent.Prototype = function() {

  this.render = function() {
    return $$('span')
      .addClass(this.getClassNames())
      .attr({
        "data-id": this.props.node.id,
        "data-external": 1,
        "contentEditable": false
      })
      .on('click', this.onClick)
      .on('mousedown', this.onMouseDown)
      .append(this.props.node.label || "");
  };

  this.getClassNames = function() {
    var classNames = this.props.node.getTypeNames().join(' ');
    if (this.props.classNames) {
      classNames += " " + this.props.classNames.join(' ');
    }
    return classNames.replace(/_/g, '-');
  };

  this.didMount = function() {
    this.props.node.connect(this, {
      "label:changed": this.onLabelChanged
    });
  };

  this.willUnmount = function() {
    this.props.node.disconnect(this);
  };

  this.onMouseDown = function(e) {
    e.preventDefault();
    var citation = this.props.node;
    var surface = this.context.surface;

    surface.setSelection(citation.getSelection());
    surface.rerenderDomSelection();
  };

  this.onClick = function(e) {
    e.preventDefault();
    e.stopPropagation();
  };

  this.onLabelChanged = function() {
    this.rerender();
  };
};

OO.inherit(CitationComponent, Component);

module.exports = CitationComponent;
