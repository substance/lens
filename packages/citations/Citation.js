var _ = require('substance/util/helpers');
var $ = require('substance/util/jquery');
var Annotation = require('substance/model/Annotation');

var Citation = Annotation.extend({
  name: "citation",

  properties: {
    targets: ["array", "id"],
    // volatile properties
    // label: computed dynamically
  },

  getDefaultProperties: function() {
    return {targets: []};
  },

  setLabel: function(label) {
    if (this.label !== label) {
      this.label = label;
      this.emit('label:changed');
    }
  },

  didAttach: function(doc) {
    if (!doc.isTransaction() && !doc.isClipboard()) {
      doc.getEventProxy('path').connect(this, [this.id, 'targets'], this.onTargetChange);
      // doc.getEventProxy('path').connect(this, [this.id, 'path'], this.onChange);
      this.updateCollection(doc);
    }
  },

  didDetach: function(doc) {
    // TODO: still not good...
    doc.getEventProxy('path').disconnect(this, [this.id, 'targets']);
    // doc.getEventProxy('path').disconnect(this, [this.id, 'path']);
    this.updateCollection(doc);
  },

  updateCollection: function(doc) {
    var collection = doc.getCollection(this.getItemType());
    if (collection) {
      collection.update();
    }
  },

  onTargetChange: function(change, info, doc) {
    this.updateCollection(doc);
  }

});

Citation.static.tagName = 'cite';
Citation.static.external = true;

Citation.static.fromHtml = function($el, converter) {
  /* jshint unused: false */
  var citation = {
    targets: _.compact($el.attr('data-rid').split(' '))
  };
  return citation;
};

Citation.static.toHtml = function(citation, converter) {
  /* jshint unused: false */
  var id = citation.id;
  var targets = citation.targets.join(' ');

  var $el = $('<cite>')
    .attr('id', id)
    .attr('data-rid', targets);
  return $el;
};


module.exports = Citation;