var Substance = require('substance');
var Citation = require('../citations/Citation');

var BibItemCitation = Citation.extend({
  name: "bib-item-citation",

  getItemType: function() {
    return 'bib-item';
  }
});

BibItemCitation.static.matchElement = function($el) {
  return $el.is(BibItemCitation.static.tagName) && $el.attr('data-rtype') === 'bib';
};

BibItemCitation.static.fromHtml = function($el, converter) {
  return Citation.static.fromHtml($el, converter);
};

BibItemCitation.static.toHtml = function(citation, converter) {
  var $el = Citation.static.toHtml(citation, converter);
  // Add specific type
  $el.attr("data-rtype", "bib");
  return $el;
};

module.exports = BibItemCitation;
