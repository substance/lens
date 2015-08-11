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

  constructor(parent, params) {
    super(parent, params);
    this.editor = new ContainerEditor(this.props.node.id);
  }

  render() {
    var doc = this.props.doc;
    return $$('div').addClass('panel-content-inner').append(
      $$(TitleEditor).key('title').addProps({ doc: doc }),
      // The full fledged document (ContainerEditor)
      $$("div").key("main").addClass("document-content").append(
        $$(ContainerNodeComponent).key('editor')
          .attr('contentEditable', true)
          .addProps({
            doc: doc,
            node: this.props.node,
            editor: this.editor
          })
      ),
      $$(BibliographyComponent).key('bib').addProps({ doc: doc })
    );
  }
}

module.exports = ContentEditor;
