var SurfaceTool = require('substance/ui/tools/surface_tool');

var InsertFigureTool = SurfaceTool.extend({
  static: {
    name: 'insertFigure',
    command: 'insertFigure'
  }
});

module.exports = InsertFigureTool;