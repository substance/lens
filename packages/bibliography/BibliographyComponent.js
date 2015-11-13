'use strict';

var _ = require('substance/util/helpers');
var oo = require('substance/util/oo');
var Component = require('substance/ui/Component');
var $$ = Component.$$;

function BibliographyComponent() {
  Component.apply(this, arguments);
}

BibliographyComponent.Prototype = function() {
  this.getDocument = function() {
    return this.context.controller.getDocument();
  };

  this.render = function() {
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

  this.didMount = function() {
    var doc = this.getDocument()
    this.bibliography = doc.getCollection('bib-item');
    this.bibliography.connect(this, {
      'bibliography:updated': this.update
    });
  };

  this.update = function() {
    var bibItems = this.bibliography.getItems();
    this.setState({
      bibItems: bibItems
    });
  };
};

oo.inherit(BibliographyComponent, Component);

module.exports = BibliographyComponent;
