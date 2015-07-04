var Substance = require('substance');
var Citation = require('./citation');

var BibItemCitation = Citation.extend({
  name: "bib_item_citation",

  getItemType: function() {
    return 'bib_item';
  },

});

BibItemCitation.static.matchElement = function($el) {
  return $el.is(BibItemCitation.static.tagName) && $el.attr('typeof') === 'bib';
};

BibItemCitation.static.fromHtml = function($el, converter) {
  return Citation.static.fromHtml($el, converter);
};

BibItemCitation.static.toHtml = function(citation, converter) {
  var $el = Citation.static.toHtml(citation, converter);
  // Add specific type
  $el.attr("typeof", "bib");
  return $el;
};

module.exports = BibItemCitation;
