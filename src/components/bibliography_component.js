"use strict";

var _ = require('substance/helpers');
var Component = require('substance/ui/component');
var $$ = Component.$$;

class BibliographyComponent extends Component {

  didMount: function() {
    var doc = this.props.doc;
    this.bibliography = doc.getCollection('bib_item');
    this.bibliography.connect(this, {
      'bibliography:updated': this.update
    });
  },

  update: function() {
    console.log('bibliography:updated');
    var doc = this.props.doc;
    var bibItems = this.bibliography.getItems();
    this.setState({
      bibItems: bibItems
    });
  },

  // Rendering
  // -------------------

  render: function() {
    var doc = this.props.doc;
    var state = this.state;

    if (state.bibItems) {
      var bibItemEls = [
        $$('div', { classNames: 'content-node heading level-1' }, 'References')
      ];
      _.each(state.bibItems, function(bibItem) {
        if (bibItem.label) {
          bibItemEls.push($$('div', { classNames: 'bib-item clearfix' },
            $$('div', { classNames: 'label csl-left-margin'}, bibItem.label),
            $$('div', { classNames: 'text csl-right-inline'}, bibItem.text)
          ));
        }
      });
      return $$('div', { classNames: 'bibliography-component bib-items'}, bibItemEls);
    } else {
      return $$('div', null, '');
    }
  }
});

module.exports = BibliographyComponent;
