"use strict";

var Component = require('substance/ui/component');
var $$ = Component.$$;

class CiteImageFigure extends Component {

  constructor(parent, props) {
    super(parent, props);

    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  get classNames() {
    return 'figure border-bottom item pad clearfix small';
  }

  render: function() {
    if (this.props.active) {
      this.$el.addClass('active');
    } else {
      this.$el.removeClass('active');
    }
    return [
      $$('img', {classNames: 'image', src: this.props.node.getContentNode().src}),
      $$('div', {classNames: 'title'}, [this.props.node.label, this.props.node.title].join(' ')),
      $$('div', {classNames: 'caption truncate'}, this.props.node.caption)
    ];
  }

  onClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  onMouseDown(e) {
    e.preventDefault();
    this.props.handleSelection(this.props.node.id);
  }

}

module.exports = CiteImageFigure;
