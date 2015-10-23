'use strict';

var oo = require('substance/util/oo');
var Component = require('substance/ui/Component');
var $$ = Component.$$;

function TableFigureEntry() {
  Component.apply(this, arguments);
}

TableFigureEntry.Prototype = function() {

  this.render = function() {
    var el = $$('div').addClass('figure border-bottom item pad clearfix small');
    el.on('click', this.onClick);
    el.on('mousedown', this.onMouseDown);
    if (this.props.active) {
      el.addClass('active');
    }
    return el.append(
      // TODO: display thumbnail version of table
      // $$('img', {className: 'image', src: this.props.node.src}),
      $$('div').addClass('title').append([this.props.node.label, this.props.node.title].join(' ')),
      $$('div').addClass('caption truncate').append(this.props.node.caption)
    );
  };

  this.onClick = function(e) {
    e.preventDefault();
    e.stopPropagation();
  };

  this.onMouseDown = function(e) {
    e.preventDefault();
    this.props.handleSelection(this.props.node.id);
  };
};

oo.inherit(TableFigureEntry, Component);

module.exports = TableFigureEntry;
