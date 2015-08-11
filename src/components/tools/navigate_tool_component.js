"use strict";

var Component = require('substance/ui/component');
var $$ = Component.$$;

// Navigate Tool Component
// ----------------
//
// Just used to trigger app state changes

class NavigateTool extends Component {

  getInitialState() {
    return { disabled: true };
  }

  render() {
    return $$('button')
      .addClass('option')
      .attr('title', this.props.title)
      .on('click', this.handleClick)
      .on('mousedown', this.handleMouseDown)
      .append(this.props.title);
  }

  handleClick(e) {
    e.preventDefault();
  }

  handleMouseDown(e) {
    e.preventDefault();
    this.context.app.setState(this.props.newState);
  }
}

module.exports = NavigateTool;
