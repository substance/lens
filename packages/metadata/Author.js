'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function Author() {
  Author.super.apply(this, arguments);
}

DocumentNode.extend(Author);

Author.static.name = "author";

Author.static.defineSchema({
  "name": "string"
});

module.exports = Author;
