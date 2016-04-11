'use strict';

var Component = require('substance/ui/Component');

function BibItemEntry() {
  Component.apply(this, arguments);
}

BibItemEntry.Prototype = function() {

  this.didMount = function() {
    this.props.node.on('label', this.onLabelChanged, this);
  };

  this.dispose = function() {
    this.props.node.off(this);
  };

  this.render = function($$) {
    var el = $$('div')
      .addClass('bib-item border-bottom pad item small clearfix')
      .attr('data-id', this.props.node.id);

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

Component.extend(BibItemEntry);

module.exports = BibItemEntry;
