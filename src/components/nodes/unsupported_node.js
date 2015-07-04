'use strict';

var $$ = React.createElement;

class UnsupportedNodeComponent extends React.Component {
  render() {
    var rawJson = JSON.stringify(this.props.node.properties, null, 2);
    return $$("pre",
      { className: "content-node unsupported", "data-id": this.props.node.id, contentEditable: false },
      rawJson
    );
  }
}

UnsupportedNodeComponent.displayName = "UnsupportedNodeComponent";

module.exports = UnsupportedNodeComponent;
