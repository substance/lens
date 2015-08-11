"use strict";

var Component = require('substance/ui/component');
var $$ = Component.$$;

class CiteBibItem extends Component {

  render() {
    var el = $$('div').addClass('bib-item border-bottom pad item small clearfix');
    el.on('click', this.onClick);
    el.on('mousedown', this.onMouseDown);
    if (this.props.active) {
      el.addClass('active');
    }
    if (this.props.node.label) {
      el.append($$('div').addClass('label').append(this.props.node.label));
    }
    el.append($$('div').addClass('text').append(this.props.node.text));
    return el;
  }

  didMount() {
    this.props.node.connect(this, {
      'label': this.onLabelChanged
    });
  }

  willUnmount() {
    this.props.node.disconnect(this);
  }

  onClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  onMouseDown(e) {
    e.preventDefault();
    this.props.handleSelection(this.props.node.id);
  }

  onLabelChanged() {
    this.rerender();
  }
}

module.exports = CiteBibItem;
