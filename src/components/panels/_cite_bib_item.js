"use strict";

var Substance = require('substance');
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;

function CiteBibItem() {
  Component.apply(this, arguments);
}

CiteBibItem.Prototype = function() {
  this.render = function() {
    var el = $$('div').addClass('bib-item border-bottom pad item small clearfix');
    el.on('click', this.onClick);
    el.on('mousedown', this.onMouseDown);
    if (this.props.active) {
      el.addClass('active');
    }
    if (this.props.node.label) {
      el.append($$('div').addClass('label').append(this.props.node.label));
    }
    el.append($$('div').addClass('text').append(this.props.node.text));
    return el;
  };

  this.didMount = function() {
    this.props.node.connect(this, {
      'label': this.onLabelChanged
    });
  };

  this.willUnmount = function() {
    this.props.node.disconnect(this);
  };

  this.onClick = function(e) {
    e.preventDefault();
    e.stopPropagation();
  };

  this.onMouseDown = function(e) {
    e.preventDefault();
    this.props.handleSelection(this.props.node.id);
  };

  this.onLabelChanged = function() {
    this.rerender();
  };
};

OO.inherit(CiteBibItem, Component);

module.exports = CiteBibItem;
