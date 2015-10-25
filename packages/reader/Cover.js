"use strict";

var OO = require('substance/util/oo');
var FormEditor = require('substance/ui/FormEditor');
var $$ = require('substance/ui/Component').$$;
var TextProperty = require("substance/ui/TextPropertyComponent");
var map = require('lodash/collection/map');

var Cover = function() {
  FormEditor.apply(this, arguments);
};

Cover.Prototype = function() {

  this.render = function() {
    var doc = this.getDocument();
    var metaNode = doc.getDocumentMeta();
    return $$("div").addClass("document-cover")
      .append(
        $$(TextProperty, {
          tagName: "div",
          className: "title",
          path: [metaNode.id, "title"]
        }).addClass('title'),

        // Editable authors
        $$('div').addClass('authors clearfix').append(
          map(metaNode.authors, function(authorId) {
            return $$(TextProperty, {
              tagName: "div",
              path: [authorId, "name"]
            }).addClass('author');
          })
        ),
        // Editable abstract
        $$('div').addClass('abstract').append(
          $$(TextProperty, {
            tagName: "div",
            className: "abstract",
            path: [metaNode.id, "abstract"]
          }).addClass('abstract')
        )
      );
  };
};

OO.inherit(Cover, FormEditor);

module.exports = Cover;