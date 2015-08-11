"use strict";

var _ = require('substance/helpers');
var Component = require('substance/ui/component');
var $$ = Component.$$;

class BibliographyComponent extends Component {

  render() {
    var state = this.state;
    if (state.bibItems) {
      var bibItemEls = [
        $$('div').addClass('content-node heading level-1').append('References')
      ];
      _.each(state.bibItems, function(bibItem) {
        if (bibItem.label) {
          bibItemEls.push($$('div').addClass('bib-item clearfix').append(
            $$('div').addClass('label csl-left-margin').append(bibItem.label),
            $$('div').addClass('text csl-right-inline').append(bibItem.text)
          ));
        }
      });
      return $$('div').addClass('bibliography-component bib-items')
        .append(bibItemEls);
    } else {
      return $$('div');
    }
  }

  didMount() {
    var doc = this.props.doc;
    this.bibliography = doc.getCollection('bib_item');
    this.bibliography.connect(this, {
      'bibliography:updated': this.update
    });
  }

  update() {
    console.log('bibliography:updated');
    var bibItems = this.bibliography.getItems();
    this.setState({
      bibItems: bibItems
    });
  }
}

module.exports = BibliographyComponent;
