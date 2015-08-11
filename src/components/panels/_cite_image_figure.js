"use strict";

var Component = require('substance/ui/component');
var $$ = Component.$$;

class CiteImageFigure extends Component {

  render() {
    var el = $$('div').addClass('figure border-bottom item pad clearfix small');
    el.on('click', this.onClick);
    el.on('mousedown', this.onMouseDown);
    if (this.props.active) {
      el.addClass('active');
    }
    return el.append(
      $$('img').addClass('image').attr('src', this.props.node.getContentNode().src),
      $$('div'.addClass('title').append([this.props.node.label, this.props.node.title].join(' ')),
      $$('div'.addClass('caption truncate').append(this.props.node.caption)
    );
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
