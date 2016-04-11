'use strict';

var Component = require('substance/ui/Component');
var TextPropertyEditor = require('substance/ui/TextPropertyEditor');

function Cover() {
  Cover.super.apply(this, arguments);
}

Cover.Prototype = function() {

  this.render = function($$) {
    var doc = this.context.controller.getDocument();
    var metaNode = doc.getDocumentMeta();
    return $$("div").addClass("document-cover")
      .append(
        $$(TextPropertyEditor, {
          name: 'title',
          tagName: "div",
          path: [metaNode.id, "title"],
          editing: 'readonly'
        }).addClass('title'),

        // Abstract
        $$('div').addClass('abstract').append(
          $$(TextPropertyEditor, {
            name: 'abstract',
            tagName: "div",
            path: [metaNode.id, "abstract"],
            editing: 'readonly'
          }).addClass('abstract')
        )
      );
  };
};

Component.extend(Cover);

module.exports = Cover;
