'use strict';

var Substance = require('substance');
var _ = require('substance/helpers');
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;

var TitleEditor = require('./title_editor');
var BibliographyComponent = require('./bibliography_component');
var ContainerNodeComponent = require('substance/ui/nodes/container_node_component');

var Surface = Substance.Surface;
var ContainerEditor = Surface.ContainerEditor;

// FIXME: make disabling of tools work again
// var ENABLED_TOOLS = ["strong", "emphasis", "comment", "text"];

function ContentEditor() {
  Component.apply(this, arguments);
  this.editor = new ContainerEditor(this.props.node.id);
}

ContentEditor.Prototype = function() {

  this.render = function() {
    var doc = this.props.doc;
    return $$('div').addClass('panel-content-inner').append(
      // $$(TitleEditor).key('title').addProps({ doc: doc }),
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
  };
};

OO.inherit(ContentEditor, Component);

module.exports = ContentEditor;
