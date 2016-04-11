'use strict';

var LensController = require('./LensController');
var BibliographyComponent = require('./packages/bibliography/BibliographyComponent');
var ContainerAnnotator = require('substance/ui/ContainerAnnotator');
var ScrollPane = require("substance/ui/ScrollPane");
var Cover = require('./packages/reader/Cover');

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
      // "table": require('substance/packages/table/TableComponent'),

      "image-figure": require('substance/packages/figure/FigureComponent'),
      // "table-figure": require('substance/packages/figure/FigureComponent'),

      "bib-item-citation": require('./packages/citations/CitationComponent'),
      "image-figure-citation": require('./packages/citations/CitationComponent'),
      // "table-figure-citation": require('./packages/citations/CitationComponent'),

      // Panels
      "toc": require('substance/ui/TOCPanel'),
      "cite": require('./packages/citations/CitePanel'),
      "bib-items": require('./packages/bibliography/BibItemsPanel'),

      // We use different states for the same panel, so we can distinguish
      // the citation type based on state.contextId
      "cite-bib-item": require('./packages/citations/CitePanel'),
      "cite-image-figure": require('./packages/citations/CitePanel'),
      // "cite-table-figure": require('./packages/citations/CitePanel'),

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

function LensReader() {
  LensReader.super.apply(this, arguments);
}

LensReader.Prototype = function() {

  var _super = LensReader.super.prototype;

  this.didMount = function() {
    _super.didMount.call(this);

    this.on('citation:selected', this.onCitationSelected, this);
  };

  this.dispose = function() {
    _super.dispose.call(this);

    this.off(this);
  };

  this.render = function() {
    var el = _super.render.apply(this, arguments);
    el.addClass('sc-lens sc-lens-reader sc-controller');
    return el;
  };

  this._renderMainSection = function($$) {
    var config = this.getConfig();

    return $$('div').ref('main').addClass('se-main-section').append(
      // Content Panel below
      $$(ScrollPane, {
        scrollbarType: 'substance',
        scrollbarPosition: 'left',
        toc: this.toc,
        highlights: this.contentHighlights
      }).ref('contentPanel').append(
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

};

LensController.extend(LensReader);

LensReader.static.config = CONFIG;

module.exports = LensReader;
