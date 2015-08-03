"use strict";

var Component = require("substance/ui/component");
var $$ = Component.$$;
var TextProperty = require("substance/ui/text_property_component");
var Surface = require("substance/surface");
var FormEditor = Surface.FormEditor;

class TitleEditor extends Component {

  constructor(parent, props) {
    super(parent, props)
  }

  getChildContext() {
    return {
      surface: this.surface
    };
  }

  render() {
    var doc = this.props.doc;
    var metaNode = doc.getDocumentMeta();
    return $$("div", {
        className: "document-title",
        contentEditable: true,
        "data-id": "title-editor"
      },
      $$(TextProperty, {
        doc: doc,
        tagName: "div",
        className: "title",
        path: [metaNode.id, "title"]
      })
    );
  }

  didReceiveProps() {
    var doc = this.props.doc;
    var editor = new FormEditor();
    this.surface = new Surface(this.context.surfaceManager, doc, editor, { name: 'title' } );
  }

  didMount() {
    this.surface.attach(this.$el[0]);
  }

  willUnmount() {
    this.surface.detach();
  }
}

module.exports = TitleEditor;
