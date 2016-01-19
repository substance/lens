'use strict';

var LensController = require('./LensController');
var SplitPane = require('substance/ui/SplitPane');
var ScrollPane = require('substance/ui/ScrollPane');
var StatusBar = require('substance/ui/StatusBar');
var BibliographyComponent = require('./packages/bibliography/BibliographyComponent');
var CoverEditor = require('./packages/writer/CoverEditor');
var Toolbar = require('substance/ui/Toolbar');
var WriterTools = require('./packages/writer/WriterTools');
var ContainerEditor = require('substance/ui/ContainerEditor');
var docHelpers = require('substance/model/documentHelpers');
var Component = require('substance/ui/Component');
var $$ = Component.$$;

var CONFIG = {
  controller: {
    commands: [
      require('substance/ui/UndoCommand'),
      require('substance/ui/RedoCommand'),
      require('substance/ui/SaveCommand')
    ],
    components: {
      "paragraph": require('substance/packages/paragraph/ParagraphComponent'),
      "heading": require('substance/packages/heading/HeadingComponent'),
      "blockquote": require('substance/packages/blockquote/BlockquoteComponent'),
      "codeblock": require('substance/packages/codeblock/CodeblockComponent'),
      "embed": require('substance/packages/embed/EmbedComponent'),
      "image": require('substance/packages/image/ImageComponent'),
      "table": require('substance/packages/table/TableComponent'),

      "image-figure": require('substance/packages/figure/FigureComponent'),
      "table-figure": require('substance/packages/figure/FigureComponent'),

      "bib-item-citation": require('./packages/citations/CitationComponent'),
      "image-figure-citation": require('./packages/citations/CitationComponent'),
      "table-figure-citation": require('./packages/citations/CitationComponent'),

      // Panels
      "toc": require('substance/ui/TOCPanel'),
      "cite": require('./packages/citations/CitePanel'),
      "bib-items": require('./packages/bibliography/BibItemsPanel'),
      "add-bib-items": require('./packages/bibliography/AddBibItemsPanel'),

      // We use different states for the same panel, so we can distinguish
      // the citation type based on state.contextId
      "cite-bib-item": require('./packages/citations/CitePanel'),
      "cite-image-figure": require('./packages/citations/CitePanel'),
      "cite-table-figure": require('./packages/citations/CitePanel'),

      "bib-item-entry": require('./packages/bibliography/BibItemEntry'),
      "image-figure-entry": require('./packages/figures/ImageFigureEntry'),
    },
  },
  main: {
    commands: [
      // Special commands
      require('substance/packages/embed/EmbedCommand'),

      require('substance/packages/text/SwitchTextTypeCommand'),
      require('substance/packages/strong/StrongCommand'),
      require('substance/packages/emphasis/EmphasisCommand'),
      require('substance/packages/link/LinkCommand'),
      require('substance/packages/subscript/SubscriptCommand'),
      require('substance/packages/superscript/SuperscriptCommand'),
      require('substance/packages/code/CodeCommand'),

      // Insert figure
      require('substance/packages/figure/InsertFigureCommand'),
      require('./packages/bibliography/BibItemCitationCommand'),
      require('./packages/figures/ImageFigureCitationCommand'),
    ],
    textTypes: [
      {name: 'paragraph', data: {type: 'paragraph'}},
      {name: 'heading1',  data: {type: 'heading', level: 1}},
      {name: 'heading2',  data: {type: 'heading', level: 2}},
      {name: 'heading3',  data: {type: 'heading', level: 3}},
      {name: 'codeblock', data: {type: 'codeblock'}},
      {name: 'blockquote', data: {type: 'blockquote'}}
    ]
  },
  title: {
    commands: [
      require('substance/packages/emphasis/EmphasisCommand'),
      require('substance/packages/text/SwitchTextTypeCommand'),
      require('substance/packages/subscript/SubscriptCommand'),
      require('substance/packages/superscript/SuperscriptCommand')
    ]
  },
  abstract: {
    commands: [
      require('substance/packages/text/SwitchTextTypeCommand'),
      require('substance/packages/emphasis/EmphasisCommand'),
      require('substance/packages/strong/StrongCommand'),
      require('substance/packages/subscript/SubscriptCommand'),
      require('substance/packages/superscript/SuperscriptCommand'),
      require('substance/packages/link/LinkCommand')
    ]
  },
  panels: {
    'toc': {
    },
    'bib-items': {
    },
    'cite-bib-item': {
      isDialog: true
    },
    'cite-image-figure': {
      idDialog: true
    },
    'add-bib-items': {
      isDialog: true
    }
  },
  tabOrder: ['toc', 'bib-items'],
  containerId: 'main',
  isEditable: true
};

function LensWriter() {
  LensWriter.super.apply(this, arguments);
}

LensWriter.Prototype = function() {

  var _super = Object.getPrototypeOf(this);

  this.render = function() {
    return _super.render.call(this)
      .addClass('sc-lens sc-lens-writer');
  };

  this._renderMainSection = function() {
    var config = this.getConfig();

    return $$('div').ref('main').addClass('se-main-section').append(
      $$(SplitPane, {splitType: 'horizontal'}).append(
        // Menu Pane on top
        $$(Toolbar).ref('toolbar').append($$(WriterTools)),
        // Content Panel below
        $$(ScrollPane, {
          scrollbarType: 'substance',
          scrollbarPosition: 'left',
          toc: this.toc,
          highlights: this.contentHighlights
        }).ref('contentPanel').append(
          $$(CoverEditor).ref('coverEditor'),
          // The full fledged document (ContainerEditor)
          $$("div").ref('main').addClass('document-content').append(
            $$(ContainerEditor, {
              name: 'main',
              containerId: config.containerId,
              commands: config.main.commands,
              textTypes: config.main.textTypes
            }).ref('mainEditor')
          ),
          $$(BibliographyComponent).ref('bib')
        )
      ).ref('mainSectionSplitPane')
    );
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
      var citationType = citation.type.replace('-citation', '').replace('_', '-');

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

LensController.extend(LensWriter);
LensWriter.static.config = CONFIG;

module.exports = LensWriter;
