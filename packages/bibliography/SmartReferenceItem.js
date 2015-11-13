var oo = require('substance/util/oo');
var Component = require('substance/ui/Component');
var $$ = Component.$$;
var Icon = require('substance/ui/FontAwesomeIcon');

// Used in BibItemsPanel
function SmartReferenceItem() {
  Component.apply(this, arguments);
}

SmartReferenceItem.Prototype = function() {

  this.toggleFocus = function() {
    this.send('toggleBibItem', this.props.node);
  };

  this.render = function() {
    var el = $$('div').addClass('se-bib-item') // .attr('data-id', this.props.node.id);

    if (this.props.highlighted) {
      el.addClass('se-highlighted');
    }

    // Label
    el.append($$('div').addClass('se-label').append(this.props.node.DOI));

    // Focus toggle
    el.append(
      $$('button').addClass('se-focus-toggle').append(
        $$(Icon, {icon: 'fa-eye'}),
        ' Focus'
      ).on('click', this.toggleFocus)
    );

    // Text
    el.append($$('div').addClass('se-text').append(this.props.node.title[0]));

    return el;
  };
};

oo.inherit(SmartReferenceItem, Component);

module.exports = SmartReferenceItem;
