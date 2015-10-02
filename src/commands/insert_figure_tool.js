var Substance = require('substance');
var Tool = Substance.Surface.Tool;

var InsertFigureTool = Tool.extend({

  name: "insert_figure",

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
  performAction: function(app) {
    var state = this.getToolState();
    var doc = this.context.doc;
    var sel = app.getSelection();
    if (state.disabled) {
      return;
    }

    var surface = state.surface;
    var $surface = state.surface.$element;
    var $inputEl = $('<input type="file" id="file_input" style="opacity: 0;">');
    $surface.append($inputEl);
    $inputEl.click();

    $inputEl.on('change', function(e) {
      var file = $inputEl[0].files[0];

      // We no longer need the file input
      $inputEl.remove();

      this.context.backend.uploadFigure(file, function(err, figureUrl) {
        // NOTE: we are providing a custom beforeState, to make sure
        // thate the correct initial selection is used.
        var beforeState = { selection: state.sel };

        surface.transaction(beforeState, function(tx, args) {
          var newImage = tx.create({
            id: Substance.uuid("image"),
            type: "image",
            src: figureUrl,
            previewSrc: figureUrl,            
          });

          var newFigure = tx.create({
            id: Substance.uuid("image_figure"),
            type: "image_figure",
            content: newImage.id,
            title: "Enter title",
            caption: "Enter caption"
          });

          var newInclude = {
            id: Substance.uuid("include"),
            type: "include",
            nodeId: newFigure.id
          };
          var editor = surface.getEditor();
          // Note: returning the result which will contain an updated selection
          return editor.insertNode(tx, { selection: args.selection, node: newInclude });
        });
      });
    }.bind(this));

  }
});

module.exports = InsertFigureTool;
