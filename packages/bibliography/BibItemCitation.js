var Citation = require('../citations/Citation');

var BibItemCitation = Citation.extend({
  name: "bib-item-citation",

  getItemType: function() {
    return 'bib-item';
  }
});


module.exports = BibItemCitation;
