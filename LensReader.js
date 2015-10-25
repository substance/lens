'use strict';

var oo = require('substance/util/oo');
var LensController = require('./LensController');

var ContextToggles = require('substance/ui/ContextToggles');
var ContentPanel = require("substance/ui/ContentPanel");
var StatusBar = require("substance/ui/StatusBar");

var BibliographyComponent = require('./packages/bibliography/BibliographyComponent');
var ContentToolbar = require('./packages/writer/ContentToolbar');
var ContainerAnnotator = require('substance/ui/ContainerAnnotator');
var Cover = require('./packages/reader/Cover');


var Component = require('substance/ui/Component');
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


      "image-figure": require('substance/packages/figure/FigureComponent'),
      "table-figure": require('substance/packages/figure/FigureComponent'),

      "bib-item-citation": require('./packages/citations/CitationComponent'),
      "image-figure-citation": require('./packages/citations/CitationComponent'),
      "table-figure-citation": require('./packages/citations/CitationComponent'),

      // Panels
      "toc": require('substance/ui/TocPanel'),
      "cite": require('./packages/citations/CitePanel'),
      "bib-items": require('./packages/bibliography/BibItemsPanel'),
      
      // We use different states for the same panel, so we can distinguish
      // the citation type based on state.contextId
      "cite-bib-item": require('./packages/citations/CitePanel'),
      "cite-image-figure": require('./packages/citations/CitePanel'),
      "cite-table-figure": require('./packages/citations/CitePanel'),

      "bib-item-entry": require('./packages/bibliography/BibItemEntry'),
      "image-figure-entry": require('./packages/figures/ImageFigureEntry'),
      "table-figure-entry": require('./packages/figures/TableFigureEntry'),

      // Manage BibItems
      "manage-bib-items": require('./packages/bibliography/ManageBibItemsPanel')
    },
  },
  main: {
    commands: [],
  },
  cover: {
    commands: []
  },
  panelOrder: ['toc', 'bib-items'],
  containerId: 'main'      
};

function LensReader(parent, params) {
  LensController.call(this, parent, params);

  this.connect(this, {
    'citation:selected': this.onCitationSelected
  });


}

LensReader.Prototype = function() {

  this.static = {
    config: CONFIG
  };

  this.getInitialState = function() {
    return {
      contextId: 'bib-items',
      citationId: 'bib_item_citation_a6da926ec7f4f4df975164f9e9ce413b',
    };
  };

  this.onCitationSelected = function(citation) {
    console.log('citation selected', citation);
    var citationType = citation.type;
    if (citation.type === 'bib-item-citation') {

      if (this.state.citationId === citation.id) {
        this.setState({
          contextId: 'toc'
        });
      } else {
        this.setState({
          contextId: 'bib-items',
          citationId: citation.id
        });
      }

    }
  };

  this.dispose = function() {
    LensController.prototype.dispose.call(this);
    this.disconnect(this);
  };

  this.render = function() {
    var doc = this.props.doc;
    var config = this.getConfig();
    var el = $$('div').addClass('lc-writer sc-controller');

    el.append(
      $$('div').ref('workspace').addClass('le-workspace').append(
        // Main (left column)
        $$('div').ref('main').addClass("le-main").append(
          $$(ContentToolbar).ref('toolbar'),
          $$(ContentPanel).append(
            // Document Cover display
            $$(Cover, {
              name: 'cover',
              commands: config.cover.commands
            }).ref('coverView'),
            
            // The main container
            $$("div").ref('main').addClass('document-content').append(
              $$(ContainerAnnotator, {
                name: 'main',
                containerId: 'main',
                editable: false,
                commands: config.main.commands
              }).ref('mainAnnotator')
            ),
            $$(BibliographyComponent).ref('bib')
          ).ref('content')
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

};

oo.inherit(LensReader, LensController);

module.exports = LensReader;
