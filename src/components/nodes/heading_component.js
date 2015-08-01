'use strict';

var Component = require('substance/ui/component');
var TextProperty = require('substance-ui/text_property');
var $$ = Component.$$;

class HeadingComponent extends React.Component {
  render() {
    var level = this.props.node.level;
    return $$("div", { classNames: "content-node heading level-"+level, "data-id": this.props.node.id },
      $$(TextProperty, {
        doc: this.props.doc,
        path: [this.props.node.id, "content"]
      })
    );
  }
}

module.exports = HeadingComponent;
