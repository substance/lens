var TOCPanel = require("substance-ui/toc_panel");
var CitePanel = require("./cite_panel");var ManageBibItemsPanel = require("./manage_bib_items_panel");

var CiteBibItem = require("./_cite_bib_item");
var CiteImageFigure = require("./_cite_image_figure");
var CiteTableFigure = require("./_cite_table_figure");

var ManageCollection = require("./manage_collection");

// TODO: currently we have a mixed style for ids 'bib_item' vs. 'manageFigures'
// We should unify this, which probably requires us to use some inflection library

module.exports = {
  "toc": TOCPanel,
  "cite": CitePanel,
  // We use different states for the same panel, so we can distinguish
  // the citation type based on state.contextId
  "cite_bib_item": CitePanel,
  "cite_image_figure": CitePanel,
  "cite_table_figure": CitePanel,

  "_cite_bib_item": CiteBibItem,
  "_cite_image_figure": CiteImageFigure,
  "_cite_table_figure": CiteTableFigure,
  // Manage BibItems
  "manageBibItems": ManageBibItemsPanel,

  // Manage Collection
  "manageCollection": ManageCollection
};
