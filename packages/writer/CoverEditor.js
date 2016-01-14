"use strict";

var Component = require('substance/ui/Component');
var $$ = require('substance/ui/Component').$$;
var TextPropertyEditor = require('substance/ui/TextPropertyEditor');

var CoverEditor = function() {
  CoverEditor.super.apply(this, arguments);
};

CoverEditor.Prototype = function() {

  this.render = function() {
    var doc = this.context.controller.getDocument();
    var config = this.context.config;

    var metaNode = doc.getDocumentMeta();
    return $$("div").addClass("document-cover")
      .append(
        // Editable title
        $$(TextPropertyEditor, {
          name: 'title',
          tagName: "div",
          commands: config.title.commands,
          path: [metaNode.id, "title"]
        }).addClass('title'),

        // Editable abstract
        $$('div').addClass('abstract').append(
          $$(TextPropertyEditor, {
            name: 'abstract',
            tagName: 'div',
            commands: config.abstract.commands,
            path: [metaNode.id, 'abstract']
          }).addClass('abstract')
        )
      );
  };
};

Component.extend(CoverEditor);

module.exports = CoverEditor;
