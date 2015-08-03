"use strict";

var _ = require("substance/helpers");
var Component = require('substance/ui/component');
var $$ = Component.$$;

// Navigate Tool Component
// ----------------
//
// Just used to trigger app state changes

class NavigateTool extends Component {

  constructor(parent, props) {
    super(parent, props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  getInitialState() {
    return { disabled: true };
  }

  render() {
    var classNames = ['option'];
    return $$("button", {
      classNames: classNames.join(' '),
      title: this.props.title,
    }, this.props.title);
  }

  handleClick(e) {
    e.preventDefault();
  }

  handleMouseDown(e) {
    e.preventDefault();
    if (this.props.replace) {
      this.context.app.replaceState(this.props.newState);
    } else {
      this.context.app.setState(this.props.newState);
    }
  }
}

module.exports = NavigateTool;
