var Substance = require('substance');
var $$ = React.createElement;

var TitleEditor = require("./title_editor");
var UnsupporedNode = require('./nodes/unsupported_node');

var Surface = Substance.Surface;
var ContainerEditor = Surface.ContainerEditor;

var ENABLED_TOOLS = ["strong", "emphasis", "comment", "text"];

// Container Node
// ----------------
//
// Represents a flat collection of nodes

var ContentEditor = React.createClass({

  displayName: "ContentEditor",

  contextTypes: {
    app: React.PropTypes.object.isRequired,
    componentRegistry: React.PropTypes.object.isRequired,
    notifications: React.PropTypes.object.isRequired,
    surfaceManager: React.PropTypes.object.isRequired
  },

  childContextTypes: {
    // provided to editor components so that they know in which context they are
    surface: React.PropTypes.object,
  },

  getChildContext: function() {
    return {
      surface: this.surface
    };
  },

  getInitialState: function() {
    var doc = this.props.doc;
    var containerId = this.props.node.id;
    var editor = new ContainerEditor(containerId);
    // TODO: this should not be configured here
    editor.defaultTextType = 'paragraph';
    var options = {
      name: this.props.node.id,
      logger: this.context.notifications
    };
    this.surface = new Surface(this.context.surfaceManager, doc, editor, options);
    return {};
  },

  render: function() {
    var containerNode = this.props.node;
    var doc = this.props.doc;

    // Prepare container components (aka nodes)
    // ---------

    var componentRegistry = this.context.componentRegistry;
    var components = [];
    components = components.concat(containerNode.nodes.map(function(nodeId) {
      var node = doc.get(nodeId);
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
    }));

    // Top level structure
    // ---------

    return $$('div', {className: 'panel-content-inner'},
      $$(TitleEditor, {
        doc: doc,
      }),
      // The full fledged document (ContainerEditor)
      $$("div", {ref: "documentContent", className: "document-content", contentEditable: true, "data-id": this.props.node.id},
        $$("div", {
            className: "container-node " + this.props.node.id,
            spellCheck: false,
            "data-id": this.props.node.id
          },
          $$('div', {className: "nodes"}, components)
        )
      )
    );
  },

  componentDidMount: function() {
    var surface = this.surface;
    var app = this.context.app;
    var doc = this.props.doc;

    doc.connect(this, {
      'document:changed': this.onDocumentChange
    });

    app.registerSurface(surface, {
      enabledTools: ENABLED_TOOLS
    });

    surface.attach(React.findDOMNode(this.refs.documentContent));

    doc.connect(this, {
      'container-annotation-update': this.handleContainerAnnotationUpdate
    });

    var self = this;

    this.forceUpdate(function() {
      // console.log('ContentEditor#componentDidMount: rerendering dom selection');
      self.surface.rerenderDomSelection();
    });
  },

  handleContainerAnnotationUpdate: function() {
  },

  componentDidUpdate: function() {
    // HACK: when the state is changed this and particularly TextProperties
    // get rerendered (e.g., as the highlights might have changed)
    // Unfortunately we loose the DOM selection then.
    // Thus, we are resetting it here, but(!) delayed as otherwise the surface itself
    // might not have finished setting the selection to the desired and a proper state.
    var self = this;
    setTimeout(function() {
      // console.log('ContentEditor#componentDidUpdate: rerendering dom selection');
      self.surface.rerenderDomSelection();
    });
  },

  componentWillUnmount: function() {
    var app = this.context.app;
    var surface = this.surface;
    var doc = this.props.doc;
    doc.disconnect(this);

    app.unregisterSurface(surface);
    surface.detach();
  },

  onDocumentChange: function(change) {
    // Re-render
    if (change.isAffected([this.props.node.id, 'nodes'])) {
      this.forceUpdate();
    }
  }

});

module.exports = ContentEditor;