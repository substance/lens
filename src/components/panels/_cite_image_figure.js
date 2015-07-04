var $$ = React.createElement;
var _ = require("substance/helpers");


var CiteImageFigure = React.createClass({
  displayName: "CiteImageFigure",

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
      $$('img', {className: 'image', src: this.props.node.getContentNode().src}),
      $$('div', {className: 'title'}, [this.props.node.label, this.props.node.title].join(' ')),
      $$('div', {className: 'caption truncate'}, this.props.node.caption)
    );
  }
});

module.exports = CiteImageFigure;