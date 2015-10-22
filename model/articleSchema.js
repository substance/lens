var Substance = require('substance');

// Substance Node Types
// ----------------------

var Paragraph = require('substance/packages/paragraph/Paragraph');
var Heading = require('substance/packages/heading/Heading');
var Codeblock = require('substance/packages/codeblock/Codeblock');
var Blockquote = require('substance/packages/blockquote/Blockquote');
var Embed = require('substance/packages/embed/Embed');
var Image = require('substance/packages/image/Image');
var List = require('substance/packages/list/List');
var ListItem = require('substance/packages/list/ListItem');
var Table = require('substance/packages/table/Table');
var TableSection = require('substance/packages/table/TableSection');
var TableRow = require('substance/packages/table/TableRow');
var TableCell = require('substance/packages/table/TableCell');
var Emphasis = require('substance/packages/emphasis/Emphasis');
var Strong = require('substance/packages/strong/Strong');
var Link = require('substance/packages/link/Link');

// Lens-specific Node Types
// ----------------------

// Figures
var Figure = require('../packages/figures/Figure');
var ImageFigure = require('../packages/figures/ImageFigure');
var TableFigure = require('../packages/figures/TableFigure');
var TableFigureCitation = require('../packages/figures/TableFigureCitation');
var ImageFigureCitation = require('../packages/figures/ImageFigureCitation');

// Bibliography
var BibItem = require('../packages/bibliography/BibItem');
var BibItemCitation = require('../packages/bibliography/BibItemCitation');

// Metadata
var Author = require('../packages/metadata/Author');
var ArticleMeta = require('../packages/metadata/ArticleMeta');

var schema = new Substance.Document.Schema("scientific-article", "0.2.0");

schema.getDefaultTextType = function() {
  return "paragraph";
};

schema.addNodes([
  ArticleMeta,
  Paragraph, Heading,
  Codeblock,
  Blockquote,
  Embed,
  Emphasis, Strong,
  Link,
  Image,
  Author,
  Figure, // abstract type (!)
  ImageFigure,
  Table, TableSection, TableRow, TableCell,
  TableFigure,
  ImageFigureCitation, TableFigureCitation, BibItemCitation,
  List, ListItem,
  BibItem,
]);

module.exports = schema;
