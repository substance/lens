"use strict";

var oo = require('substance/util/oo');
var Component = require('substance/ui/Component');
var $$ = Component.$$;

function ImageFigureEntry() {
  Component.apply(this, arguments);
}

ImageFigureEntry.Prototype = function() {

  this.render = function() {
    var el = $$('div')
      .addClass('figure border-bottom item pad clearfix small')
      .on('click', this.onClick)
      .on('mousedown', this.onMouseDown);
    if (this.props.active) {
      el.addClass('active');
    }
    el.append($$('img')
      .addClass('image')
      .attr('src', this.props.node.getContentNode().src)
    );
    el.append($$('div')
      .addClass('title')
      .append([this.props.node.label, this.props.node.title].join(' '))
    );
    el.append($$('div')
      .addClass('caption truncate').append(this.props.node.caption)
    );
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
};

oo.inherit(ImageFigureEntry, Component);

module.exports = ImageFigureEntry;
