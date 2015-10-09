"use strict";

var OO = require('substance/basics/oo');
var FormEditor = require('substance/ui/form_editor');
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

// var Substance = require('substance');
// var OO = Substance.OO;
// var Component = Substance.Component;
// var $$ = Component.$$;

// var TextProperty = require("substance/ui/text_property_component");
// var Surface = Substance.Surface;
// var FormEditor = Surface.FormEditor;

// function TitleEditor() {
//   Component.apply(this, arguments);

//   // var doc = this.props.doc;
//   var editor = new FormEditor();
//   this.surface = new Surface(this.context.controller, editor, { 
//     name: 'title',
//     commands: this.props.commands
//   });
//   this.childContext = {
//     surface: this.surface
//   };
// }


// TitleEditor.Prototype = function() {
  
//   this.didMount = function() {
//     this.surface.attach(this.$el[0]);
//   };

//   this.dispose = function() {
//     this.surface.detach();
//   };

//   this.render = function() {
//     var doc = this.props.doc;
//     var metaNode = doc.getDocumentMeta();
//     return $$("div").addClass("document-title")
//       .attr({
//         contentEditable: true,
//         "data-id": "title-editor"
//       })
//       .append(
//         $$(TextProperty, {
//           doc: doc,
//           tagName: "div",
//           className: "title",
//           path: [metaNode.id, "title"]
//         }).addClass('title')
//       );
//   };

// };


