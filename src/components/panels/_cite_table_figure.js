"use strict";

var Component = require('substance/ui/component');
var $$ = Component.$$;

class CiteTableFigure extends Component {

  constructor(parent, props) {
    super(parent, props);

    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  render() {
    var el = $$('div', {
      classNames: 'figure border-bottom item pad clearfix small'
    });
    if (this.props.active) {
      el.addClass('active');
    }
    return el.append(
      // TODO: display thumbnail version of table
      // $$('img', {className: 'image', src: this.props.node.src}),
      $$('div', {className: 'title'}, [this.props.node.label, this.props.node.title].join(' ')),
      $$('div', {className: 'caption truncate'}, this.props.node.caption)
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

module.exports = CiteTableFigure;
