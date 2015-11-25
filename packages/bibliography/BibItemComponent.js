var Component = require('substance/ui/Component');
var $$ = Component.$$;
var Icon = require('substance/ui/FontAwesomeIcon');

// Used in BibItemsPanel
function BibItemComponent() {
  Component.apply(this, arguments);
}

BibItemComponent.Prototype = function() {

  this.toggleFocus = function() {
    this.send('toggleBibItem', this.props.node);
  };

  this.render = function() {
    var el = $$('div').addClass('sc-bib-item').attr('data-id', this.props.node.id);
    if (this.props.highlighted) {
      el.addClass('se-highlighted');
    }
    // Label
    el.append($$('div').addClass('se-label').append(this.props.node.label));
    // Focus toggle
    el.append(
      $$('button').addClass('se-focus-toggle').append(
        $$(Icon, {icon: 'fa-eye'}),
        [' ', this.props.toggleName].join('')
      ).on('click', this.toggleFocus)
    );
    // Text
    el.append($$('div').addClass('se-text').append(this.props.node.text));
    return el;
  };
};

Component.extend(BibItemComponent);
module.exports = BibItemComponent;