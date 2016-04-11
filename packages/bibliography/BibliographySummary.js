'use strict';

var Component = require('substance/ui/Component');

function BibliographySummary() {
  Component.apply(this, arguments);
}

BibliographySummary.Prototype = function() {

  this.render = function($$) {
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

  this.handleAddBibItems = function(e) {
    e.preventDefault();
    this.send('switchContext', 'add-bib-items');
  };
};

Component.extend(BibliographySummary);

module.exports = BibliographySummary;
