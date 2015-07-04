var $$ = React.createElement;
var _ = require("substance/helpers");


var CiteBibItem = React.createClass({
  displayName: "CiteBibItem",

  onClick: function(e) {
    e.preventDefault();
    e.stopPropagation();
  },

  onMouseDown: function(e) {
    e.preventDefault();
    this.props.handleSelection(this.props.node.id);
  },

  onLabeChanged: function() {
    this.forceUpdate();
  },

  componentWillMount: function() {
    this.props.node.connect(this, {
      'label': this.onLabeChanged
    });
  },

  componentWillUnmount: function() {
    this.props.node.disconnect(this);
  },

  render: function() {
    var classNames = ['bib-item border-bottom pad item small clearfix'];
    if (this.props.active) classNames.push('active');

    var children = [$$('div', {className: 'text'}, this.props.node.text)];
    if (this.props.node.label) {
      children.unshift($$('div', {className: 'label'}, this.props.node.label));
    }

    return $$("div", {
      className: classNames.join(" "),
      onClick: this.onClick,
      onMouseDown: this.onMouseDown
    },
      children
    );
  }
});

module.exports = CiteBibItem;