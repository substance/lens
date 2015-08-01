'use strict';

var Component = require('substance/ui/component');
var $$ = Component.$$;

class CitationComponent extends Component {

  constructor(parent, props) {
    super(parent, props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  get tagName() {
    return 'span'
  }

  get classNames() {
    var classNames = this.props.node.getClassNames();
    if (this.props.classNames) {
      classNames += " " + this.props.classNames.join(' ');
    }
    return classNames.replace(/_/g, '-');
  }

  get attributes() {
    return {
      "data-id": this.props.node.id,
      "data-external": 1,
      "contentEditable": false
    }
  }

  didMount() {
    this.props.node.connect(this, {
      "label:changed": this.onLabelChanged
    });

    this.$el.on('click', this.onClick);
    this.$el.on('mousedown', this.onMouseDown);
  }

  willUnmount() {
    this.props.node.disconnect(this);
  }

  render() {
    return this.props.node.label || "";
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
