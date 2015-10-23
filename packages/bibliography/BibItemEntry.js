"use strict";

var oo = require('substance/util/oo');
var Component = require('substance/ui/Component');
var $$ = Component.$$;

function BibItemEntry() {
  Component.apply(this, arguments);

  this.props.node.connect(this, {
    'label': this.onLabelChanged
  });
}

BibItemEntry.Prototype = function() {

  this.dispose = function() {
    this.props.node.disconnect(this);
  };

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

oo.inherit(BibItemEntry, Component);

module.exports = BibItemEntry;
