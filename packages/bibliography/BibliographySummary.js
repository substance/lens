'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;

function BibliographySummary() {
  BibliographySummary.super.apply(this, arguments);
}

BibliographySummary.Prototype = function() {
  this.handleAddBibItems = function(e) {
    e.preventDefault();
    this.send('switchContext', 'add-bib-items');
  };

  this.render = function() {
    var el = $$('div').addClass('se-bibliography-summary');

    el.append(
      $$('p').append(
        'Your bibliography has ',
        $$('strong').append(this.props.bibItems.length.toString(), ' references'),
        ' in total.'
        // $$('strong').append('? references'),
        // 'are not cited.'
      )
    );

    var config = this.context.config;
    if (config.isEditable) {
      el.append(
        $$('p').append(
          $$('a').attr({href: '#'})
            .on('click', this.handleAddBibItems)
            .append('Add references')
        )
      );
    }
    return el;
  };
};

Component.extend(BibliographySummary);

module.exports = BibliographySummary;
