'use strict';

var InlineNodeComponent = require('substance/ui/InlineNodeComponent');

function CitationComponent() {
  InlineNodeComponent.apply(this, arguments);
}

CitationComponent.Prototype = function() {

  var _super = InlineNodeComponent.prototype;

  this.didMount = function() {
    _super.didMount.call(this);

    this.props.node.on("label:changed", this.onLabelChanged, this);
  };

  this.dispose = function() {
    _super.dispose.call(this);

    this.props.node.off(this);
  };

  this.render = function($$) {
    var el = _super.render.call(this, $$);
    el.addClass(this.getClassNames())
      .attr("data-id", this.props.node.id)
      .on('click', this.onClick)
      .on('mousedown', this.onMouseDown)
    el.append(this.props.node.label || "");
    return el;
  };

  this.getClassNames = function() {
    var classNames = ['sc-citation', 'sm-'+this.props.node.type];
    if (this.props.node.highlighted) {
      classNames.push('sm-highlighted');
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
