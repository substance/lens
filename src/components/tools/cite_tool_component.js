'use strict';

var $$ = React.createElement;

// CiteToolComponent
// -------------

class CiteToolComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      disabled: true
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentWillMount() {
    this.tool = this.context.toolRegistry.get("cite");
    if (!this.tool) {
      throw new Error('No tool registered with name'+ toolName);
    }
    this.tool.connect(this, {
      'toolstate:changed': this.onToolstateChanged
    });
  }

  onToolstateChanged(toolState) {
    this.setState({
      disabled: toolState.disabled
    });
  }

  onClick(e) {
    e.preventDefault();
  }

  onMouseDown(e) {
    e.preventDefault();
    if (this.state.disabled) return;

    var citation = this.tool.createCitation(this.props.citationType);

    this.context.app.replaceState({
      contextId: "cite",
      citationType: this.props.citationType,
      citationId: citation.id
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.disabled !== nextState.disabled;
  }

  render() {
    var classNames = [];
    if (this.props.classNames) classNames = this.props.classNames.slice();
    if (this.state.disabled) classNames.push('disabled');

    return $$("button", {
      className: classNames.join(' '),
      title: this.props.title,
      onMouseDown: this.onMouseDown,
      onClick: this.onClick
    }, this.props.children);
  }
};


CiteToolComponent.displayName = "CiteToolComponent";

CiteToolComponent.contextTypes = {
  toolRegistry: React.PropTypes.object.isRequired,
  app: React.PropTypes.object.isRequired
};

module.exports = CiteToolComponent;