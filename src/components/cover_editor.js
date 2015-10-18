"use strict";

var OO = require('substance/basics/oo');
var FormEditor = require('substance/ui/surface').FormEditor;
var $$ = require('substance/ui/component').$$;
var TextProperty = require("substance/ui/text_property_component");
var map = require('lodash/collection/map');

var CoverEditor = function() {
  FormEditor.apply(this, arguments);
};

CoverEditor.Prototype = function() {

  this.render = function() {
    var doc = this.props.doc;
    var metaNode = doc.getDocumentMeta();
    return $$("div").addClass("document-cover")
      .attr({
        contentEditable: true,
        "data-id": "title-editor"
      })
      .append(
        // Editable title
        $$(TextProperty, {
          doc: doc,
          tagName: "div",
          className: "title",
          path: [metaNode.id, "title"]
        }).addClass('title'),

        // Editable authors
        $$('div').addClass('authors clearfix').append(
          map(metaNode.authors, function(authorId) {
            return $$(TextProperty, {
              doc: doc,
              tagName: "div",
              path: [authorId, "name"]
            }).addClass('author');
          })
        ),
        // Editable abstract
        $$('div').addClass('abstract').append(
          $$('div').attr({contenteditable: false})/*.html('<strong>Abstract:</strong>')*/,
          $$(TextProperty, {
            doc: doc,
            tagName: "div",
            className: "abstract",
            path: [metaNode.id, "abstract"]
          }).addClass('abstract')
        )
      );
  };
};

OO.inherit(CoverEditor, FormEditor);

module.exports = CoverEditor;