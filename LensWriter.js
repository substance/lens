'use strict';

var Substance = require('substance');
var OO = Substance.OO;
var LensController = require('./LensController');

var ContextToggles = require('substance/ui/ContextToggles');
var ContentPanel = require("substance/ui/ContentPanel");
var StatusBar = require("substance/ui/StatusBar");

var ContentToolbar = require('./packages/writer/ContentToolbar');
var docHelpers = require('substance/document/helpers');
var Component = require('substance/ui/component');
var $$ = Component.$$;

var CONFIG = {
  controller: {
    commands: [
      require('substance/ui/UndoCommand'),
      require('substance/ui/RedoCommand'),
      require('substance/ui/SaveCommand'),
    ],
    components: {
      "paragraph": require('substance/packages/paragraph/ParagraphComponent'),
      "heading": require('substance/packages/heading/HeadingComponent'),
      "blockquote": require('substance/packages/blockquote/BlockquoteComponent'),
      "codeblock": require('substance/packages/codeblock/CodeblockComponent'),
      "embed": require('substance/packages/embed/EmbedComponent'),
      "image": require('substance/packages/image/ImageComponent'),
      "table": require('substance/packages/table/TableComponent'),

      "image-figure": require('substance/packages/paragraph/ParagraphComponent'),
      "table-figure": require('substance/packages/paragraph/ParagraphComponent'),

      "bib-item-citation": require('./packages/citations/CitationComponent'),
      "image-figure-citation": require('./packages/citations/CitationComponent'),
      "table-figure-citation": require('./packages/citations/CitationComponent'),

      // Panels
      "toc": require('substance/ui/TocPanel'),
      "cite": require('./packages/citations/CitePanel'),
      
      // We use different states for the same panel, so we can distinguish
      // the citation type based on state.contextId
      "cite-bib-item": require('./packages/citations/CitePanel'),
      "cite-image-figure": require('./packages/citations/CitePanel'),
      "cite-table-figure": require('./packages/citations/CitePanel'),

      "bib-item-entry": require('./packages/bibliography/BibItemEntry'),
      "image_figure-entry": require('./packages/figures/ImageFigureEntry'),
      "table-figure-entry": require('./packages/figures/TableFigureEntry'),

      // Manage BibItems
      "manage-bib-items": require('./packages/bibliography/ManageBibItemsPanel'),
      "content-toolbar": require('./packages/writer/ContentToolbar'),
      "content-container": require('./packages/writer/ContentEditor')
    },
  },
  main: {
    commands: [
      require('substance/ui/SelectAllCommand'),

      // Special commands
      require('substance/packages/embed/EmbedCommand'),
      require('substance/packages/paragraph/MakeParagraphCommand'),
      require('substance/packages/heading/MakeHeading1Command'),
      require('substance/packages/heading/MakeHeading2Command'),
      require('substance/packages/heading/MakeHeading3Command'),
      require('substance/packages/text/SwitchTextTypeCommand'),
      require('substance/packages/blockquote/MakeBlockquoteCommand'),
      require('substance/packages/codeblock/MakeCodeblockCommand'),
      require('substance/packages/strong/StrongCommand'),
      require('substance/packages/emphasis/EmphasisCommand'),
      require('substance/packages/link/LinkCommand'),

      // Insert figure
      require('./packages/figures/InsertFigureCommand'),
      require('./packages/bibliography/BibItemCitationCommand'),
      require('./packages/figures/ImageFigureCitationCommand'),
    ]
  },
  cover: {
    commands: [
      require('substance/packages/emphasis/EmphasisCommand'),
    ]
  },
  panelOrder: ['toc', 'manage-bib-items'],
  containerId: 'main'      
};


function LensWriter(parent, params) {
  LensController.call(this, parent, params);
}

LensWriter.Prototype = function() {

  this.static = {
    config: CONFIG
  };

  this.render = function() {
    var doc = this.props.doc;
    var config = this.getConfig();
    var el = $$('div').addClass('lc-writer sc-controller');

    // Basic 2-column layout
    // -------------

    el.append(
      $$('div').ref('workspace').addClass('le-workspace').append(
        // Main (left column)
        $$('div').ref('main').addClass("le-main").append(
          $$(ContentToolbar).ref('toolbar'),
          $$(ContentPanel, {
            doc: doc,
            containerId: config.containerId
          }).ref('content')
        ),
        // Resource (right column)
        $$('div').ref('resource')
          .addClass("le-resource")
          .append(
            $$(ContextToggles, {
              panelOrder: config.panelOrder,
              contextId: this.state.contextId
            }).ref("context-toggles"),
            this.renderContextPanel()
          )
      )
    );

    // Status bar
    el.append(
      $$(StatusBar, {doc: doc}).ref('statusBar')
    );
    return el;
  };

  this.onSelectionChanged = function(sel, surface) {
    function getActiveAnno(type) {
      return docHelpers.getAnnotationsForSelection(doc, sel, type, 'main')[0];
    }

    if (surface.name !== "main") return;
    if (sel.isNull() || !sel.isPropertySelection()) {
      return;
    }
    if (sel.equals(this.prevSelection)) {
      return;
    }
    this.prevSelection = sel;
    var doc = surface.getDocument();
    var citation = getActiveAnno('citation');

    if (citation && citation.getSelection().equals(sel)) {
      // Trigger state change
      var citationType = citation.type.replace('_citation', '').replace('_', '-');

      this.setState({
        contextId: "cite-"+citationType,
        citationType: citationType,
        citationId: citation.id
      });
    } else {
      if (this.state.contextId !== 'toc') {
        this.setState({
          contextId: "toc"
        });
      }
    }
  };
};

OO.inherit(LensWriter, LensController);

module.exports = LensWriter;
