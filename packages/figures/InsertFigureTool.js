var SurfaceTool = require('substance/ui/SurfaceTool');

var InsertFigureTool = SurfaceTool.extend({
  static: {
    name: 'insertFigure',
    command: 'insertFigure'
  }
});

module.exports = InsertFigureTool;