"use strict";

var OO = require('substance/util/oo');
var Component = require('substance/ui/Component');
var TextPropertyAnnotator = require('substance/ui/TextPropertyAnnotator');
var $$ = require('substance/ui/Component').$$;
var TextProperty = require("substance/ui/TextPropertyComponent");

var Cover = function() {
  Component.apply(this, arguments);
};

Cover.Prototype = function() {

  this.render = function() {
    var doc = this.context.controller.getDocument();
    var metaNode = doc.getDocumentMeta();
    return $$("div").addClass("document-cover")
      .append(
        $$(TextPropertyAnnotator, {
          name: 'title',
          tagName: "div",
          path: [metaNode.id, "title"]
        }).addClass('title'),

        // Abstract
        $$('div').addClass('abstract').append(
          $$(TextPropertyAnnotator, {
            name: 'abstract',
            tagName: "div",
            path: [metaNode.id, "abstract"]
          }).addClass('abstract')
        )
      );
  };
};

OO.inherit(Cover, Component);

module.exports = Cover;