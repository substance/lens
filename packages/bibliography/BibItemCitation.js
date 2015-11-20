var Citation = require('../citations/Citation');

function BibItemCitation() {
  BibItemCitation.super.apply(this, arguments);
}

Citation.extend(BibItemCitation, {
  getItemType: function() {
    return 'bib-item';
  }
});

BibItemCitation.static.name = "bib-item-citation";

module.exports = BibItemCitation;
