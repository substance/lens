var SurfaceTool = require('substance/ui/tools/surface_tool');

var InsertFigureTool = SurfaceTool.extend({
  static: {
    name: 'Figure',
    command: 'insertFigure'
  }
});

module.exports = InsertFigureTool;