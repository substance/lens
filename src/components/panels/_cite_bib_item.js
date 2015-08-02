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

  get classNames() {
    return 'bib-item border-bottom pad item small clearfix';
  }

  render() {
    if (this.props.active) {
      this.$el.addClass('active');
    } else {
      this.$el.removeClass('active');
    }
    var children = [ $$('div', { classNames: 'text' }, this.props.node.text)];
    if (this.props.node.label) {
      children.unshift($$('div', {classNames: 'label'}, this.props.node.label));
    }
    return children;
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
