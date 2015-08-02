var $$ = React.createElement;
var Substance = require("substance");
var TextProperty = require("substance/ui/text_property_compnent");

var Surface = Substance.Surface;
var FormEditor = Surface.FormEditor;

var TitleEditor = React.createClass({
  displayName: "TitleEditor",

  getChildContext: function() {
    return {
      surface: this.surface
    };
  },

  componentWillMount: function() {
    var doc = this.props.doc;
    var editor = new FormEditor();
    this.surface = new Surface(this.context.surfaceManager, doc, editor, { name: 'title' } );
    return {};
  },

  componentDidMount: function() {
    var app = this.context.app;
    app.registerSurface(this.surface);
    this.surface.attach(React.findDOMNode(this));
  },

  componentWillUnmount: function() {
    var app = this.context.app;
    app.unregisterSurface(this.surface);
    this.surface.detach();
  },

  // Rendering
  // -------------------

  render: function() {
    var app = this.context.app;
    var doc = app.doc;
    var metaNode = doc.getDocumentMeta();

    return $$("div", {className: "document-title", contentEditable: true, "data-id": "title-editor"},
      $$(TextProperty, {
        doc: app.doc,
        tagName: "div",
        className: "title",
        path: [metaNode.id, "title"]
      })
    );
  }
});

module.exports = TitleEditor;
