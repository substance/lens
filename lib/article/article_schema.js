var Substance = require('substance');

var Include = Substance.Document.Include;
var Paragraph = Substance.Document.Paragraph;
var Heading = Substance.Document.Heading;
var Emphasis = Substance.Document.Emphasis;
var Strong = Substance.Document.Strong;
var Link = Substance.Document.Link;
var Table = Substance.Document.Table;
var TableSection = Substance.Document.TableSection;
var TableRow = Substance.Document.TableRow;
var TableCell = Substance.Document.TableCell;
var List = Substance.Document.List;
var ListItem = Substance.Document.ListItem;

var ArticleMeta = require('./nodes/article_meta');
var Figure = require('./nodes/figure');
var ImageFigure = require('./nodes/image_figure');
var TableFigure = require('./nodes/table_figure');
var Image = require('./nodes/image');
var BibItem = require('./nodes/bib_item');
var ImageFigureCitation = require('./nodes/image_figure_citation');
var TableFigureCitation = require('./nodes/table_figure_citation');
var BibItemCitation = require('./nodes/bib_item_citation');

var schema = new Substance.Document.Schema("scientific-article", "0.0.1");

schema.getDefaultTextType = function() {
  return "paragraph";
};

schema.addNodes([
  Include,
  ArticleMeta,
  Paragraph, Heading,
  Emphasis, Strong,
  Link,
  Image,
  Figure, // abstract!
  ImageFigure,
  Table, TableSection, TableRow, TableCell,
  TableFigure,
  ImageFigureCitation, TableFigureCitation, BibItemCitation,
  List, ListItem,
  BibItem,
]);

module.exports = schema;
