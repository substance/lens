'use strict';

var Substance = require('substance');
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;

// CiteToolComponent
// -------------

function CiteToolComponent() {
  Component.apply(this, arguments);
}

CiteToolComponent.Prototype = function() {

  this.getInitialState = function() {
    return {
      disabled: true
    };
  };

  this.render = function() {
    var el = $$("button").attr('title', this.props.title);
    el.on('click', this.onClick);
    el.on('mousedown', this.onMouseDown);
    if (this.props.classNames){
      el.addClass(this.props.classNames.join(' '));
    }
    if (this.state.disabled) {
      el.addClass('disabled');
    }
    el.append(this.props.children);
    return el;
  };

  this.didMount = function() {
    this.tool = this.context.toolRegistry.get("cite");
    if (!this.tool) {
      throw new Error('No tool registered with name "cite"');
    }
    this.tool.connect(this, {
      'toolstate:changed': this.onToolstateChanged
    });
  };

  this.willUnmount = function() {
    this.tool.disconnect(this);
  };

  this.onToolstateChanged = function(toolState) {
    this.setState({
      disabled: toolState.disabled
    });
  };

  this.onClick = function(e) {
    e.preventDefault();
  };

  this.onMouseDown = function(e) {
    e.preventDefault();
    if (this.state.disabled) return;
    var citation = this.tool.createCitation(this.props.citationType);
    this.context.app.setState({
      contextId: "cite",
      citationType: this.props.citationType,
      citationId: citation.id
    });
  };
};

OO.inherit(CiteToolComponent, Component);

module.exports = CiteToolComponent;
