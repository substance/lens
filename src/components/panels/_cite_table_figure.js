var $$ = React.createElement;
var _ = require("substance/helpers");

var CiteTableFigure = React.createClass({
  displayName: "CiteTableFigure",

  onClick: function(e) {
    e.preventDefault();
    e.stopPropagation();
  },

  onMouseDown: function(e) {
    e.preventDefault();
    this.props.handleSelection(this.props.node.id);
  },

  render: function() {
    var classNames = ['figure border-bottom item pad clearfix small'];
    if (this.props.active) classNames.push('active');

    return $$("div", {
      className: classNames.join(" "),
      onClick: this.onClick,
      onMouseDown: this.onMouseDown
    },
      // TODO: display thumbnail version of table
      // $$('img', {className: 'image', src: this.props.node.src}),
      $$('div', {className: 'title'}, [this.props.node.label, this.props.node.title].join(' ')),
      $$('div', {className: 'caption truncate'}, this.props.node.caption)
    );
  }
});

module.exports = CiteTableFigure;