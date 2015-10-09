'use strict';

var Substance = require('substance');
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;

// var TitleEditor = require('./title_editor');
var BibliographyComponent = require('./bibliography_component');

// var Surface = Substance.Surface;
// var ContainerEditor = Surface.ContainerEditor;
var ContainerEditor = require('substance/ui/container_editor');

function ContentEditor() {
  Component.apply(this, arguments);
}

ContentEditor.Prototype = function() {

  this.render = function() {
    var doc = this.props.doc;
    return $$('div').addClass('panel-content-inner').append(
      // $$(TitleEditor, {
      //   doc: doc,
      //   commands: this.context.config.commands.title,
      // }).ref('title'),

      // The full fledged document (ContainerEditor)
      $$("div").ref("main").addClass("document-content").append(
        $$(ContainerEditor, {
          containerId: 'main',
          doc: doc,
          commands: this.context.config.commands.title
        }).ref('editor')
        // $$(ContainerNodeComponent, {
        //   doc: doc,
        //   node: this.props.node,
        //   commands: this.context.config.commands[this.props.node.id],
        //   editor: this.editor          
        // }).ref('editor')
        //   .attr('contentEditable', true)
      ),
      $$(BibliographyComponent, {doc: doc}).ref('bib')
    );
  };
};

OO.inherit(ContentEditor, Component);

module.exports = ContentEditor;
