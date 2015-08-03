var _ = require('substance/helpers');
var SubstanceTools = require('substance').Surface.Tools;

module.exports = _.extend({}, {
  "redo": SubstanceTools.Redo,
  "undo": SubstanceTools.Undo,
  "export": require("./export_tool"),
  "text": SubstanceTools.SwitchTextType,
  "emphasis": SubstanceTools.Emphasis,
  "strong": SubstanceTools.Strong,
  "link": SubstanceTools.Link,
  "cite": require("./cite_tool"),
  "insert_figure": require("./insert_figure_tool"),
  "insert_table": require("./insert_table_tool"),
  "insert_columns": SubstanceTools.InsertColumns,
  "delete_columns": SubstanceTools.DeleteColumns,
  "insert_rows": SubstanceTools.InsertRows,
  "delete_rows": SubstanceTools.DeleteRows,
});
