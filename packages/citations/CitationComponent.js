'use strict';

var InlineNodeComponent = require('substance/ui/InlineNodeComponent');

function CitationComponent() {
  InlineNodeComponent.apply(this, arguments);

  this.props.node.connect(this, {
    "label:changed": this.onLabelChanged
  });
}

CitationComponent.Prototype = function() {

  var _super = InlineNodeComponent.prototype;

  this.dispose = function() {
    _super.dispose.call(this);
    this.props.node.disconnect(this);
  };

  this.render = function() {
    var el = _super.render.call(this);
    el.addClass(this.getClassNames())
      .attr("data-id", this.props.node.id)
      .on('click', this.onClick)
      .on('mousedown', this.onMouseDown)
      .append(this.props.node.label || "");
    return el;
  };

  this.getClassNames = function() {
    var classNames = ['sc-citation', 'sm-'+this.props.node.type];
    if (this.props.node.highlighted) {
      classNames.push('sm-highlighted');
      // classNames.push('sm-'+this.props.node.highlightedScope);
    }
    return classNames.join(' ');
  };

  this.onMouseDown = function(e) {
    e.preventDefault();
    e.stopPropagation();
    var citation = this.props.node;
    var surface = this.context.surface;
    surface.setSelection(citation.getSelection());
    var controller = this.context.controller;
    controller.emit('citation:selected', citation);
  };

  this.onClick = function(e) {
    e.preventDefault();
    e.stopPropagation();
  };

  this.onLabelChanged = function() {
    this.rerender();
  };
};

InlineNodeComponent.extend(CitationComponent);

module.exports = CitationComponent;
