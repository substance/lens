'use strict';

var TextProperty = require('substance-ui/text_property');
var $$ = React.createElement;
var _ = require('substance/helpers');
var Substance = require('substance');
var TableSelection = Substance.Document.TableSelection;

// var NO_RECT = { start: { row: -1, col: -1 }, end: { row: -1, col: -1 } };

class TableComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: 'table'
    };

    this.onDoubleClick = _.bind(this.onDoubleClick, this);
    this.onMouseDown = _.bind(this.onMouseDown, this);
  }

  componentDidMount() {
    this.context.surface.connect(this, {
      "selection:changed": this.onSelectionChange
    });
    var el = React.findDOMNode(this);
    // HACK: disabling dragging support as we only hide the DOM selection
    // $(el).on('dragstart', function(e) {
    //   e.preventDefault();
    // });
    $(el).on('mousedown', 'th,td', this.onMouseDown);
  }

  componentWillUnmount() {
    this.context.surface.disconnect(this);
  }

  render() {
    var tableNode = this.props.node;
    // HACK: make sure row col indexes are up2date
    tableNode.getMatrix();
    var secEls = [];
    var secs = tableNode.getSections();
    _.each(secs, function(sec) {
      var rowEls = [];
      var rows = sec.getRows();
      _.each(rows, function(row) {
        rowEls.push(this._renderRow(row));
      }, this);
      secEls.push($$("t"+sec.sectionType, {key: sec.id }, rowEls));
    }, this);

    var classNames = ["content-node", "table"];
    if (this.state.mode === "table") {
      classNames.push('table-editing-mode');
    } else if (this.state.mode === "cell") {
      classNames.push('cell-editing-mode');
    }

    var tableProps = {
      className: classNames.join(" "),
      "data-id": this.props.node.id,
      contentEditable: false
    };
    return $$("table", tableProps, secEls);
  }

  _renderRow(row) {
    var doc = this.props.doc;
    var cellEls = [];

    var cells = row.getCells();
    _.each(cells, function(cell) {
      var cellTag = cell.cellType === 'head' ? 'th' : 'td';
      var cellProps = {
        key: cell.id,
        "data-id": cell.id,
        "data-row": cell.rowIdx,
        "data-col": cell.colIdx,
        onDoubleClick: this.onDoubleClick
      };
      if (cell.colspan) {
        cellProps.colSpan = cell.colspan;
      }
      if (cell.rowspan) {
        cellProps.rowSpan = cell.rowspan;
      }
      if (this.state.mode === "cell") {
        if (cell.rowIdx === this.state.row && cell.colIdx === this.state.col) {
          cellProps.contentEditable = "true";
        }
      }
      cellEls.push($$(cellTag, cellProps, $$(TextProperty, {
        key: cell.id+".content",
        doc: doc,
        path: [ cell.id, "content"]
      })));
    }, this);

    return $$("tr", {key: row.id, "data-id": row.id, contentEditable:false}, cellEls);
  }

  onDoubleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    var surface = this.context.surface;
    var $cell = $(e.currentTarget);
    var cellId = $cell.data('id');
    // switch the state
    this.setState({
      mode: "cell",
      cellId: cellId,
      row: $cell.data('row'),
      col: $cell.data('col')
    }, function() {
      var doc = surface.getDocument();
      var path = [cellId, 'content'];
      var text = doc.get(path);
      surface.setSelection({
        type: 'property',
        path: path,
        startOffset: text.length,
      });
    });
  }

  onMouseDown(e) {
    var el = React.findDOMNode(this);
    var $el = $(el);
    var surface = this.context.surface;
    var doc = surface.getDocument();
    var id = this.props.node.id;
    var self = this;
    // 1. get the anchor cell (for click or select)
    var $cell = $(e.currentTarget);

    if (this.state.mode === "cell" && this.state.cellId === $cell.data('id')) {
      // do not override selection behavior within a cell
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    var $startCell = $cell;
    var $endCell = $cell;
    var rectangle = new TableSelection.Rectangle(
      $startCell.data('row'),
      $startCell.data('col'),
      $endCell.data('row'),
      $endCell.data('col')
    );
    // 2. enable onMouseOver delegate which updates the displayed selection region
    var onMouseOver = function(e) {
      $endCell = $(e.currentTarget);
      rectangle = new TableSelection.Rectangle($startCell.data('row'), $startCell.data('col'),
        $endCell.data('row'), $endCell.data('col'));
      self._updateSelection(rectangle);
    };
    $el.on('mouseenter', 'th,td', onMouseOver);
    // 3. enable onMouseUp hook: stop dragging the selection and
    // finally set the Surface's selection
    $(window).one('mouseup', function(e) {
      e.stopPropagation();
      e.preventDefault();
      $el.off('mouseenter', 'th,td', onMouseOver);
      var tableSelection = doc.createSelection({
        type: 'table',
        tableId: id,
        rectangle: rectangle
      });
      surface.setSelection(tableSelection);
    });
  }

  onSelectionChange(sel) {
    var node = this.props.node;
    var id = node.id;
    if (this.hasSelection) {
      this._clearSelection();
    }
    if (this.state.mode === "cell") {
      if (!sel.isPropertySelection() || sel.start.path[0] !== this.state.cellId) {
        var self = this;
        this.setState({
          mode: "table"
        }, function() {
          if (sel.isTableSelection() && sel.getTableId() === id) {
            self._updateSelection(sel.rectangle);
          }
        });
      }
    } else {
      if (sel.isTableSelection() && sel.getTableId() === id) {
        this._updateSelection(sel.rectangle);
      }
    }
  }

  _updateSelection(rectangle) {
    var el = React.findDOMNode(this);
    var $el = $(el);
    var $cells = $el.find('th,td');
    $cells.each(function() {
      var $cell = $(this);
      var row = $cell.data('row');
      var col = $cell.data('col');
      if (row >= rectangle.start.row && row <= rectangle.end.row &&
        col >= rectangle.start.col && col <= rectangle.end.col) {
        $cell.addClass("selected");
      } else {
        $cell.removeClass("selected");
      }
    });
    this.hasSelection = true;
  }

  _clearSelection() {
    var el = React.findDOMNode(this);
    var $el = $(el);
    var $cells = $el.find('th,td');
    $cells.removeClass('selected');
    this.hasSelection = false;
  }

}

TableComponent.displayName = "TableComponent";

TableComponent.contextTypes = {
  surface: React.PropTypes.object.isRequired
};

module.exports = TableComponent;
