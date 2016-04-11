'use strict';

var _ = require('substance/util/helpers');
var Component = require('substance/ui/Component');

function BibliographyComponent() {
  Component.apply(this, arguments);

  var doc = this.getDocument();
  this.bibliography = doc.getCollection('bib-item');
}

BibliographyComponent.Prototype = function() {

  this.didMount = function() {
    this.bibliography.on('bibliography:updated', this.update, this);
  };

  this.dispose = function() {
    this.bibliography.off(this);
  };

  this.render = function($$) {
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
  };

  this.getDocument = function() {
    return this.context.controller.getDocument();
  };

  this.update = function() {
    var bibItems = this.bibliography.getItems();
    this.setState({
      bibItems: bibItems
    });
  };
};

Component.extend(BibliographyComponent);

module.exports = BibliographyComponent;
