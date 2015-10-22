var Substance = require('substance');
var Tool = Substance.Surface.Tool;
var Article = require('../../lib/article');

var TABLE = [
  '<table-figure>',
    '<title>Enter title.</title>',
    '<table>',
      '<thead>',
       '<tr><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th></tr>',
      '</thead>',
      '<tbody>',
        '<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td></tr>',
        '<tr><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>2</td></tr>',
        '<tr><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td></tr>',
        '<tr><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td></tr>',
        '<tr><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td></tr>',
      '</tbody>',
    '</table>',
    '<caption>Enter caption</caption>',
  '</table-figure>'
].join('');

var InsertTableTool = Tool.extend({
  name: "insert_table",
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
    var sel = app.getSelection();
    if (state.disabled) {
      return;
    }
    var surface = this.surface;
    var editor = surface.getEditor();

    // var $table = $(TABLE);
    // We need some more XML aware parsing here
    // TODO: put parsing code into a module somewhere
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(TABLE, "text/xml");
    var $table = $(xmlDoc).find('table-figure');

    surface.transaction({ selection: sel }, function(tx, args) {
      var htmlImporter = new Article.ArticleHtmlImporter();
      htmlImporter.initialize(tx, $table);
      var tableNode = htmlImporter.convertElement($table);
      // Note: returning the result which will contain an updated selection
      return editor.insertNode(tx, { selection: args.selection, node: tableNode });      
    });
  }
});

module.exports = InsertTableTool;
