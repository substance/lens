"use strict";

var OO = require('substance/util/oo');
var TextPropertyAnnotator = require('substance/ui/TextPropertyAnnotator');
var $$ = require('substance/ui/Component').$$;
var TextProperty = require("substance/ui/TextPropertyComponent");

var Cover = function() {
  TextPropertyAnnotator.apply(this, arguments);
};

Cover.Prototype = function() {

  this.render = function() {
    var doc = this.context.controller.getDocument();
    var metaNode = doc.getDocumentMeta();
    return $$("div").addClass("document-cover")
      .append(
        $$(TextProperty, {
          tagName: "div",
          className: "title",
          path: [metaNode.id, "title"]
        }).addClass('title'),
        
        // Abstract
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

OO.inherit(Cover, TextPropertyAnnotator);

module.exports = Cover;