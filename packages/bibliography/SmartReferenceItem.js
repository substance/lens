var oo = require('substance/util/oo');
var Component = require('substance/ui/Component');
var $$ = Component.$$;
var Icon = require('substance/ui/FontAwesomeIcon');

// Used in BibItemsPanel
function SmartReferenceItem() {
  Component.apply(this, arguments);
}

SmartReferenceItem.Prototype = function() {
  this.render = function() {
    var el = $$('div')
      .addClass('bib-item border-bottom pad item small clearfix')
      .attr('data-id', this.props.node.DOI);

    el.on('click', this.onClick);
    el.on('mousedown', this.onMouseDown);
    if (this.props.active) {
      el.addClass('active');
    }

    el.append($$('div').addClass('label').append(this.props.node.DOI));

    el.append($$('div').addClass('text').append(this.props.node.title[0]));
    el.append($$('div').addClass('text').append(this.props.node.match));
    return el;
  };

  this.onClick = function(e) {
    e.preventDefault();
    e.stopPropagation();
  };

  this.onMouseDown = function(e) {
    e.preventDefault();
    this.props.handleSelection(this.props.node);
  };

  this.onLabelChanged = function() {
    this.rerender();
  };
};

oo.inherit(SmartReferenceItem, Component);

module.exports = SmartReferenceItem;
