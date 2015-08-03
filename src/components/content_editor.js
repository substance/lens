"use strict";

var Component = require('substance/ui/component');
var $$ = Component.$$;

var TitleEditor = require('./title_editor');
var BibliographyComponent = require('./bibliography_component');
var ContainerNodeComponent = require('substance/ui/nodes/container_node_component');

var Surface = require('substance/surface');
var ContainerEditor = Surface.ContainerEditor;

// FIXME: make disabling of tools work again
// var ENABLED_TOOLS = ["strong", "emphasis", "comment", "text"];

class ContentEditor extends Component {

  constructor(parent, props) {
    super(parent, props);

    this.editor = new ContainerEditor(this.props.node.id);
  }

  render() {
    var doc = this.props.doc;
    return $$('div', {classNames: 'panel-content-inner'},
      $$(TitleEditor, { key: 'title', doc: doc }),
      // The full fledged document (ContainerEditor)
      $$("div", {
          key: "main",
          classNames: "document-content"
        },
        $$(ContainerNodeComponent, {
          key: 'editor',
          doc: doc,
          node: this.props.node,
          editor: this.editor,
          contentEditable: true,
        })
      ),
      $$(BibliographyComponent, { key: 'bib', doc: doc })
    );
  }
}

module.exports = ContentEditor;
