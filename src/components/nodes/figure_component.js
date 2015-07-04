'use strict';

var TextProperty = require('substance-ui/text_property');
var $$ = React.createElement;

class FigureComponent extends React.Component {
  render() {
    var componentRegistry = this.context.componentRegistry;
    var contentNode = this.props.node.getContentNode();
    var ContentComponentClass = componentRegistry.get(contentNode.type);

    return $$('div', { className: "content-node figure clearfix", "data-id": this.props.node.id },
      $$('div', {className: 'label', contentEditable: false}, this.props.node.label),
      $$(TextProperty, {
        tagName: 'div',
        // ref: "textProp",
        className: 'title',
        doc: this.props.doc,
        path: [ this.props.node.id, "title"]
      }),

      $$('div', {
        className: 'figure-content'
      },
        $$(ContentComponentClass, {
          doc: this.props.doc,
          node: contentNode
        })
      ),

      $$('div', {className: 'description small'},
        $$(TextProperty, {
          tagName: 'div',
          className: 'caption',
          ref: "textProp",
          doc: this.props.doc,
          path: [ this.props.node.id, "caption"]
        })
      )
    );
  }
}

FigureComponent.displayName = "FigureComponent";

FigureComponent.contextTypes = {
  componentRegistry: React.PropTypes.object.isRequired
};

module.exports = FigureComponent;
