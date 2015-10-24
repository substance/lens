'use strict';

var oo = require('substance/util/oo');
var Component = require('substance/ui/Component');
var $$ = Component.$$;

var BibliographyComponent = require('../bibliography/BibliographyComponent');
// var CoverEditor = require('./CoverEditor');
var ContainerAnnotator = require('substance/ui/ContainerAnnotator');

function ContentEditor() {
  Component.apply(this, arguments);
}

ContentEditor.Prototype = function() {

  this.render = function() {
    var doc = this.props.doc;
    return $$('div').addClass('panel-content-inner').append(
      // $$(CoverEditor, {
      //   name: 'cover',
      //   doc: doc,
      //   commands: this.context.config.cover.commands,
      // }).ref('cover'),

      // The full fledged document (ContainerEditor)
      $$("div").ref('main').addClass('document-content').append(
        $$(ContainerAnnotator, {
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

oo.inherit(ContentEditor, Component);

module.exports = ContentEditor;
