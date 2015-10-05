"use strict";

var Substance = require('substance');
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;

var TextProperty = require("substance/ui/text_property_component");
var Surface = Substance.Surface;
var FormEditor = Surface.FormEditor;

function TitleEditor() {
  Component.apply(this, arguments);

  var doc = this.props.doc;
  var editor = new FormEditor();
  this.surface = new Surface(this.context.controller, editor, { name: 'title' } );
  this.childContext = {
    surface: this.surface
  };
}

TitleEditor.Prototype = function() {

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

  this.didMount = function() {
    this.surface.attach(this.$el[0]);
  };

  this.willUnmount = function() {
    this.surface.detach();
  };
};

OO.inherit(TitleEditor, Component);

module.exports = TitleEditor;
