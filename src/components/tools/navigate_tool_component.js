"use strict";

var Substance = require('substance');
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;

// Navigate Tool Component
// ----------------
//
// Just used to trigger app state changes

function NavigateTool() {
  Component.apply(this, arguments);
}

NavigateTool.Prototype = function() {

  this.getInitialState = function() {
    return { disabled: true };
  };

  this.render = function() {
    return $$('button')
      .addClass('option')
      .attr('title', this.props.title)
      .on('click', this.handleClick)
      .on('mousedown', this.handleMouseDown)
      .append(this.props.title);
  };

  this.handleClick = function(e) {
    e.preventDefault();
  };

  this.handleMouseDown = function(e) {
    e.preventDefault();
    this.send('switchState', this.props.newState);
  };
};

OO.inherit(NavigateTool, Component);

module.exports = NavigateTool;
