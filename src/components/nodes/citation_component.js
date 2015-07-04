'use strict';

var $$ = React.createElement;

class CitationComponent extends React.Component {

  constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    this.props.node.connect(this, {
      "label:changed": this.onLabelChanged
    });
  }

  componentWillUnmount() {
    this.props.node.disconnect(this);
  }

  render() {
    return $$('span', {
      className: this.getClassName(),
      "data-id": this.props.node.id,
      "data-external": 1,
      "contentEditable": false,
      onClick: this.onClick,
      onMouseDown: this.onMouseDown
    }, this.props.node.label || "");
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
    this.forceUpdate();
  }

  getClassName() {
    var classNames = this.props.node.getClassNames();
    if (this.props.classNames) {
      classNames += " " + this.props.classNames.join(' ');
    }
    return classNames.replace(/_/g, '-');
  }
}

CitationComponent.displayName = "CitationComponent";
CitationComponent.contextTypes = {
  surface: React.PropTypes.object.isRequired,
  app: React.PropTypes.object.isRequired
};

module.exports = CitationComponent;
