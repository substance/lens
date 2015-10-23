'use strict';

var Substance = require('substance');
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;

var BibliographyComponent = require('../bibliography/BibliographyComponent');
var CoverEditor = require('./CoverEditor');
var ContainerEditor = require('substance/ui/ContainerEditor');

function ContentEditor() {
  Component.apply(this, arguments);
}

ContentEditor.Prototype = function() {

  this.render = function() {
    var doc = this.props.doc;
    return $$('div').addClass('panel-content-inner').append(
      $$(CoverEditor, {
        name: 'cover',
        doc: doc,
        commands: this.context.config.cover.commands,
      }).ref('cover'),

      // The full fledged document (ContainerEditor)
      $$("div").ref('main').addClass('document-content').append(
        $$(ContainerEditor, {
          name: 'main',
          containerId: 'main',
          doc: doc,
          commands: this.context.config.main.commands
        }).ref('editor')
      ),
      $$(BibliographyComponent, {doc: doc}).ref('bib')
    );
  };
};

OO.inherit(ContentEditor, Component);

module.exports = ContentEditor;
