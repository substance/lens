"use strict";

var Component = require('substance/ui/component');
var $$ = Component.$$;

class CiteBibItem extends Component {

  constructor(parent, props) {
    super(parent, props);

    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onLabelChanged = this.onLabelChanged.bind(this);
  }

  render() {
    var el = $$('div', {
      classNames: 'bib-item border-bottom pad item small clearfix'
    });
    if (this.props.active) {
      el.addClass('active');
    }
    if (this.props.node.label) {
      el.append($$('div', {classNames: 'label'}, this.props.node.label));
    }
    el.append($$('div', { classNames: 'text' }, this.props.node.text));
    return el;
  }

  didMount() {
    this.$el.on('click', this.onClick);
    this.$el.on('mousedown', this.onMouseDown);
    this.props.node.connect(this, {
      'label': this.onLabelChanged
    });
  }

  willUnmount() {
    this.$el.off('click', this.onClick);
    this.$el.off('mousedown', this.onMouseDown);
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
