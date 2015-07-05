var $$ = React.createElement;
var Substance = require('substance');
var _ = require('substance/helpers');


var BibliographyComponent = React.createClass({
  displayName: "BibliographyComponent",

  componentWillMount: function() {
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

  getInitialState: function() {
    return {};
  },

  // Rendering
  // -------------------

  render: function() {
    var doc = this.props.doc;
    var state = this.state;

    if (state.bibItems) {
      var bibItemEls = [$$('div', {className: 'content-node heading level-1'}, 'References')];
      _.each(state.bibItems, function(bibItem) {
        if (bibItem.label) {
          bibItemEls.push($$('div', {className: 'bib-item clearfix', key: bibItem.id},
            $$('div', {className: 'label csl-left-margin'}, bibItem.label),
            $$('div', {className: 'text csl-right-inline'}, bibItem.text)
          ));
        }
      });
      return $$('div', {className: 'bibliography-component bib-items'}, bibItemEls);
    } else {
      return $$('div', null, '');
    }
  }
});

module.exports = BibliographyComponent;
