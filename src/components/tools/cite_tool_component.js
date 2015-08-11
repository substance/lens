'use strict';

var Component = require('substance/ui/component');
var $$ = Component.$$;

// CiteToolComponent
// -------------

class CiteToolComponent extends Component {

  getInitialState() {
    return {
      disabled: true
    };
  }

  render() {
    var el = $$("button").attr('title', this.props.title);
    el.on('click', this.onClick);
    el.on('mousedown', this.onMouseDown);
    if (this.props.classNames){
      el.addClass(this.props.classNames.join(' '));
    }
    if (this.state.disabled) {
      el.addClass('disabled');
    }
    el.append(this.props.children);
    return el;
  }

  didMount() {
    this.tool = this.context.toolRegistry.get("cite");
    if (!this.tool) {
      throw new Error('No tool registered with name "cite"');
    }
    this.tool.connect(this, {
      'toolstate:changed': this.onToolstateChanged
    });
  }

  willUnmount() {
    this.tool.disconnect(this);
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
    this.context.app.setState({
      contextId: "cite",
      citationType: this.props.citationType,
      citationId: citation.id
    });
  }
}

module.exports = CiteToolComponent;
