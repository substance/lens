"use strict";

var OO = require('substance/basics/oo');
var FormEditor = require('substance/ui/surface').FormEditor;
var $$ = require('substance/ui/component').$$;
var TextProperty = require("substance/ui/text_property_component");
var ToggleEmphasis = require('substance/ui/commands/toggle_emphasis');

var TitleEditor = function() {
  FormEditor.apply(this, arguments);
};

TitleEditor.Prototype = function() {
  // Needs to be activated in Component.js
  this.getDefaultProps = function() {
    return {
      name: 'title',
      commands: [ToggleEmphasis]
    };
  };

  this.render = function() {
    var doc = this.props.doc;
    var metaNode = doc.getDocumentMeta();
    return $$("div").addClass("document-title")
      .attr({
        contentEditable: true,
        "data-id": "title-editor"
      })
      .append(
        $$(TextProperty, {
          doc: doc,
          tagName: "div",
          className: "title",
          path: [metaNode.id, "title"]
        }).addClass('title')
      );
  };
};

OO.inherit(TitleEditor, FormEditor);

module.exports = TitleEditor;