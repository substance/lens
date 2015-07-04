var $$ = React.createElement;
var _ = require("substance/helpers");

// Navigate Tool Component
// ----------------
// 
// Just used to trigger app state changes

var NavigateTool = React.createClass({
  displayName: "NavigateTool",

  contextTypes: {
    app: React.PropTypes.object.isRequired
  },

  handleClick: function(e) { e.preventDefault(); },
  getInitialState: function() { return { disabled: true }; },

  handleMouseDown: function(e) {
    e.preventDefault();

    if (this.props.replace) {
      this.context.app.replaceState(this.props.newState);
    } else {
      this.context.app.setState(this.props.newState);
    }
  },

  render: function() {
    var classNames = ['option'];

    return $$("button", {
      className: classNames.join(' '),
      title: this.props.title,
      onMouseDown: this.handleMouseDown,
      onClick: this.handleClick
    }, this.props.title);
  }
});

module.exports = NavigateTool;
