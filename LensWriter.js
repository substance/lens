'use strict';

var extend = require('lodash/object/extend');
var LensController = require('./LensController');
var ContentPanel = require("substance/ui/ContentPanel");
var StatusBar = require("substance/ui/StatusBar");
var BibliographyComponent = require('./packages/bibliography/BibliographyComponent');
var CoverEditor = require('./packages/writer/CoverEditor');
var Toolbar = require('substance/ui/Toolbar');
var WriterTools = require('./packages/writer/WriterTools');
var ContainerEditor = require('substance/ui/ContainerEditor');
var docHelpers = require('substance/model/documentHelpers');
var Component = require('substance/ui/Component');
var ContextSection = require('substance/ui/ContextSection');
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
      "toc": require('substance/ui/TocPanel'),
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
      "table-figure-entry": require('./packages/figures/TableFigureEntry')
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
      hideContextToggles: false
    },
    'bib-items': {
      hideContextToggles: false
    },
    'cite-bib-item': {
      hideContextToggles: true
    },
    'cite-image-figure': {
      hideContextToggles: true
    },
    'add-bib-items': {
      hideContextToggles: true
    }
  },
  panelOrder: ['toc', 'bib-items'],
  containerId: 'main',
  isEditable: true
};

function LensWriter(parent, params) {
  LensController.call(this, parent, params);
}

LensWriter.Prototype = function() {

  this.render = function() {
    var doc = this.props.doc;
    var config = this.getConfig();
    var el = $$('div').addClass('lc-writer sc-controller');

    var workspace = $$('div').ref('workspace').addClass('le-workspace');

    workspace.append(
      // Main (left column)
      $$('div').ref('main').addClass("le-main").append(
        $$(Toolbar).ref('toolbar').append($$(WriterTools)),

        $$(ContentPanel).append(
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
        ).ref('content')
      )
    );

    workspace.append(
      $$(ContextSection, extend({}, this.state, {
        panelConfig: config.panels[this.state.contextId],
      })).ref(this.state.contextId)
    );

    el.append(workspace);

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
