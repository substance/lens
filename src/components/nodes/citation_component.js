'use strict';

var Component = require('substance/ui/component');
var $$ = Component.$$;

class CitationComponent extends Component {

  render() {
    return $$('span')
      .addClass(this.getClassNames())
      .attr({
        "data-id": this.props.node.id,
        "data-external": 1,
        "contentEditable": false
      })
      .on('click', this.onClick)
      .on('mousedown', this.onMouseDown)
      .append(this.props.node.label || "");
  }

  getClassNames() {
    var classNames = this.props.node.getTypeNames().join(' ');
    if (this.props.classNames) {
      classNames += " " + this.props.classNames.join(' ');
    }
    return classNames.replace(/_/g, '-');
  }

  didMount() {
    this.props.node.connect(this, {
      "label:changed": this.onLabelChanged
    });
  }

  willUnmount() {
    this.props.node.disconnect(this);
  }

  onMouseDown(e) {
    e.preventDefault();
    var citation = this.props.node;
    var surface = this.context.surface;

    surface.setSelection(citation.getSelection());
    surface.rerenderDomSelection();
  }

  onClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  onLabelChanged() {
    this.rerender();
  }
}

module.exports = CitationComponent;
