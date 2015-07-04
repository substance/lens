'use strict';

var TextProperty = require('substance-ui/text_property');
var $$ = React.createElement;

class ParagraphComponent extends React.Component {
  render() {
    return $$("div", { className: "content-node paragraph", "data-id": this.props.node.id },
      $$(TextProperty, {
        ref: "textProp",
        doc: this.props.doc,
        path: [ this.props.node.id, "content"]
      })
    );
  }
}

ParagraphComponent.displayName = "ParagraphComponent";

module.exports = ParagraphComponent;
