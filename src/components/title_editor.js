"use strict";

var Component = require("substance/ui/component");
var $$ = Component.$$;
var TextProperty = require("substance/ui/text_property_component");
var Surface = require("substance/surface");
var FormEditor = Surface.FormEditor;

class TitleEditor extends Component {

  get childContext() {
    return {
      surface: this.surface
    };
  }

  render() {
    var doc = this.props.doc;
    var metaNode = doc.getDocumentMeta();
    return $$("div").addClass("document-title")
      .attr({
        contentEditable: true,
        "data-id": "title-editor"
      })
      .append(
        $$(TextProperty).addClass('title')
          .addProps({
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
