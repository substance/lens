'use strict';

var Substance = require('substance');
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;

var BibliographyComponent = require('./bibliography_component');

var TitleEditor = require('./title_editor');
var ContainerEditor = require('substance/ui/container_editor');

function ContentEditor() {
  Component.apply(this, arguments);
}

ContentEditor.Prototype = function() {

  this.render = function() {
    var doc = this.props.doc;
    return $$('div').addClass('panel-content-inner').append(
      $$(TitleEditor, {
        name: 'title',
        doc: doc,
        commands: this.context.config.commands.title,
      }).ref('title'),

      // The full fledged document (ContainerEditor)
      $$("div").ref('main').addClass('document-content').append(
        $$(ContainerEditor, {
          name: 'main',
          containerId: 'main',
          doc: doc,
          commands: this.context.config.commands.main
        }).ref('editor')
      ),
      $$(BibliographyComponent, {doc: doc}).ref('bib')
    );
  };
};

OO.inherit(ContentEditor, Component);

module.exports = ContentEditor;
