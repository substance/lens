'use strict';

var Component = require('substance/ui/Component');
var TextPropertyAnnotator = require('substance/ui/TextPropertyAnnotator');
var $$ = require('substance/ui/Component').$$;

function Cover() {
  Cover.super.apply(this, arguments);
}

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

Component.extend(Cover);

module.exports = Cover;
