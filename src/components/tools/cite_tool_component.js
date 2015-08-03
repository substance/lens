'use strict';

var Component = require('substance/ui/component');
var $$ = Component.$$;

// CiteToolComponent
// -------------

class CiteToolComponent extends Component {

  constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  getInitialState() {
    return {
      disabled: true
    };
  }

  render() {
    var classNames = [];
    if (this.props.classNames) classNames = this.props.classNames.slice();
    if (this.state.disabled) classNames.push('disabled');
    return $$("button", {
      classNames: classNames.join(' '),
      title: this.props.title,
    }, this.props.children);
  }

  didMount() {
    this.tool = this.context.toolRegistry.get("cite");
    if (!this.tool) {
      throw new Error('No tool registered with name "cite"');
    }
    this.tool.connect(this, {
      'toolstate:changed': this.onToolstateChanged
    });

    this.$el.on('mousedown', this.onMouseDown);
    this.$el.on('click', this.onClick);
  }

  willUnmount() {
    this.tool.disconnect(this);
    this.$el.off('mousedown', this.onMouseDown);
    this.$el.off('click', this.onClick);
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
}

module.exports = CiteToolComponent;