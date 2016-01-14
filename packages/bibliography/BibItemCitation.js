'use strict';

var Citation = require('../citations/Citation');

function BibItemCitation() {
  BibItemCitation.super.apply(this, arguments);
}

BibItemCitation.Prototype = function() {
  this.getItemType = function() {
    return 'bib-item';
  };
};

Citation.extend(BibItemCitation);

BibItemCitation.static.name = "bib-item-citation";

module.exports = BibItemCitation;
