'use strict';

var LensController = require('./LensController');
var ContentPanel = require("substance/ui/ContentPanel");
var StatusBar = require("substance/ui/StatusBar");
var BibliographyComponent = require('./packages/bibliography/BibliographyComponent');
var ContainerAnnotator = require('substance/ui/ContainerAnnotator');
var SplitPane = require("substance/ui/SplitPane");
var Cover = require('./packages/reader/Cover');
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
    commands: [],
  },
  cover: {
    commands: []
  },
  panels: {
    'toc': {
    },
    'bib-items': {
    }
  },
  tabOrder: ['toc', 'bib-items'],
  containerId: 'main',
  isEditable: false
};

function LensReader(parent, params) {
  LensController.call(this, parent, params);

  this.connect(this, {
    'citation:selected': this.onCitationSelected
  });
}

LensReader.Prototype = function() {

  this.onCitationSelected = function(citation) {
    if (this.state.citationId === citation.id) {
      this.setState({
        contextId: 'toc'
      });
      return;
    }

    if (citation.type === 'bib-item-citation') {
      this.setState({
        contextId: 'bib-items',
        citationId: citation.id
      });
    } else {
      this.setState({
        contextId: 'toc',
        citationId: citation.id
      });
    }
  };

  this.dispose = function() {
    LensController.prototype.dispose.call(this);
    this.disconnect(this);
  };

  this._renderMainSection = function() {
    var config = this.getConfig();

    return $$('div').ref('main').addClass('se-main-section').append(
      // Content Panel below
      $$(ContentPanel).ref('contentPanel').append(
        $$(Cover, {
          name: 'cover',
          commands: config.cover.commands
        }).ref('coverView'),
        // The full fledged document (ContainerEditor)
        $$("div").ref('main').addClass('document-content').append(
          $$(ContainerAnnotator, {
            name: 'main',
            editable: false,
            containerId: config.containerId,
            commands: config.main.commands
          }).ref('mainEditor')
        ),
        $$(BibliographyComponent).ref('bib')
      )
    );
  };

  this.render = function() {
    return $$('div').addClass('sc-lens sc-lens-reader sc-controller').append(
      $$(SplitPane, {splitType: 'vertical', sizeA: '60%'}).append(
        this._renderMainSection(),
        this._renderContextSection()
      ).ref('splitPane')
    );
  };
};

LensController.extend(LensReader);

LensReader.static.config = CONFIG;

module.exports = LensReader;
