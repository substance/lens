'use strict';

var TextProperty = require('substance-ui/text_property');
var $$ = React.createElement;
var UnsupportedNode = require('./unsupported_node');

class IncludeComponent extends React.Component {
  render() {
    var doc = this.props.doc;
    var node = doc.get(this.props.node.nodeId);
    var componentRegistry = this.context.componentRegistry;

    var ComponentClass = componentRegistry.get(node.type);

    if (!ComponentClass) {
      console.error('Could not resolve a component for type: ' + node.type);
      ComponentClass = UnsupporedNode;
    }

    return $$(ComponentClass, {
      key: node.id,
      doc: doc,
      node: node
    });
  }
}

IncludeComponent.displayName = "IncludeComponent";

IncludeComponent.contextTypes = {
  app: React.PropTypes.object.isRequired,
  componentRegistry: React.PropTypes.object.isRequired
};

module.exports = IncludeComponent;
