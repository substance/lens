// Generic dynamic collection of figures and tables
// -----------------
// 
// Takes care of generating labels and keeping them up to date

var Substance = require("substance");
var _ = require("substance/helpers");

function Collection(doc, containerId, itemType, labelPrefix) {
  this.doc = doc;
  this.containerId = containerId;
  this.itemType = itemType;
  this.labelPrefix = labelPrefix;

  // Initialization
  this.update();
}

Collection.Prototype = function() {

  this.getDocument = function() {
    return this.doc;
  };

  // Determines item order by checking their occurence in the container
  this.determineItems = function() {
    var doc = this.doc;
    var container = doc.get(this.containerId);
    var items = doc.getIndex('type').get(this.itemType);

    // Map itemIds (figures/tables) to container positions
    var map = {};
    _.each(items, function(item) {
      var pos = container.getPosition(item.id);
      // Make sure not included items are pushed to the bottom
      if (pos < 0) {
        pos = Number.MAX_VALUE;
      }
      map[item.id] = {
        pos: pos,
        item: item
      };
    });

    items = _.pluck(_.sortBy(items, 'pos'), 'item');
    return items;
  };

  this.createItemLabel = function(item) {
    var index = this.items.indexOf(item);
    return [this.labelPrefix, index + 1].join(' ');
  };

  this.createCitationLabel = function(citation) {
    var targets = citation.targets;
    var targetPositions = [];
    var doc = this.doc;

    _.each(targets, function(targetId) {
      var target = doc.get(targetId);
      var targetPos = this.items.indexOf(target) + 1;
      targetPositions.push(targetPos);
    }, this);

    targetPositions.sort();
    return [this.labelPrefix, targetPositions.join(",")];
  };

  this.updateItemLabels = function() {
    _.each(this.items, function(item) {
      var label = this.createItemLabel(item);
      item.setLabel(label);
    }, this);
  };

  this.updateCitationLabels = function() {
    _.each(this.citations, function(citation) {
      var label = this.createCitationLabel(citation);
      citation.setLabel(label);
    }, this);
  };

  // get citation nodes sorted by occurence in container.
  this.determineCitations = function() {
    var doc = this.doc;
    var citations = doc.getIndex('type').get(this.itemType+'_citation');
    var container = doc.get(this.container);

    // generate information for sorting
    var citationItems = _.map(citations, function(citation) {
      var comp = container.getComponent(citation.path);
      return {
        citation: citation,
        comp: comp
      };
    });

    // sort citation by occurrence in the container
    citationItems.sort(function(a, b) {
      var result = a.comp.getIndex() - b.comp.getIndex();
      if (result === 0) {
        result = a.citation.startOffset - b.citation.startOffset;
      }
      return result;
    });

    this.citations = citationItems;
  };

  this.update = function() {
    this.items = this.determineItems();
    this.citations = this.determineCitations();

    this.updateItemLabels();
    this.updateCitationLabels();
  };

  this.getItems = function() {
    return this.items;
  };

};

Substance.initClass(Collection);