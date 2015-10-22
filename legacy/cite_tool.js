var Substance = require('substance');
var Tool = Substance.Surface.Tool;
var _ = require("substance/helpers");


var CiteTool = Tool.extend({
  name: "cite",
  update: function(surface, sel) {
    this.surface = surface; // IMPORTANT!
    // Set disabled when not a property selection
    if (!surface.isEnabled() || sel.isNull() || !sel.isPropertySelection()) {
      return this.setDisabled();
    }
    var newState = {
      surface: surface,
      sel: sel,
      disabled: false
    };
    this.setToolState(newState);
  },

  // Needs app context in order to request a state switch

  createCitation: function(citationTargetType) {
    var citation;

    var doc = this.context.doc;
    var citationType = doc.getSchema().getNodeClass(citationTargetType).static.citationType;
    var surface = this.surface;
    var editor = surface.getEditor();

    console.log('citationType', citationType);
    surface.transaction(function(tx, args) {
      var selection = args.selection;
      var path = selection.start.path;
      var startOffset = selection.start.offset;
      if (!selection.isCollapsed) {
        var out = editor.delete(tx, args);
        args.selection = out.selection;
      }
      args.text = '$';
      editor.insertText(tx, args);
      citation = tx.create({
        id: Substance.uuid(citationType),
        "type": citationType,
        "targets": [],
        "path": path,
        "startOffset": startOffset,
        "endOffset": startOffset + 1,
      });
      citation.label = "???";
      args.selection = citation.getSelection();
      return args;
    });
    return citation;
  },

  toggleTarget: function(citationId, targetId) {
    var doc = this.context.doc;
    var citation = doc.get(citationId);
    var newTargets = citation.targets.slice();
    if (_.includes(newTargets, targetId)) {
      newTargets = _.without(newTargets, targetId);
    } else {
      newTargets.push(targetId);
    }
    this.surface.transaction(function(tx, args) {
      tx.set([citation.id, "targets"], newTargets);
      return args;
    });
  }
});

module.exports = CiteTool;
