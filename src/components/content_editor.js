'use strict';

var Substance = require('substance');
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;

var TitleEditor = require('./title_editor');
var BibliographyComponent = require('./bibliography_component');
var ContainerNodeComponent = require('substance/ui/nodes/container_node_component');

var Surface = Substance.Surface;
var ContainerEditor = Surface.ContainerEditor;

function ContentEditor() {
  Component.apply(this, arguments);
  this.editor = new ContainerEditor(this.props.node.id);
}

ContentEditor.Prototype = function() {

  this.render = function() {
    var doc = this.props.doc;
    return $$('div').addClass('panel-content-inner').append(
      $$(TitleEditor, {doc: doc}).ref('title'),
      // The full fledged document (ContainerEditor)
      $$("div").ref("main").addClass("document-content").append(
        $$(ContainerNodeComponent, {
          doc: doc,
          node: this.props.node,
          editor: this.editor          
        }).ref('editor')
          .attr('contentEditable', true)
      ),
      $$(BibliographyComponent, {doc: doc}).ref('bib')
    );
  };
};

OO.inherit(ContentEditor, Component);

module.exports = ContentEditor;
