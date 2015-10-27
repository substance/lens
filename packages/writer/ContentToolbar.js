'use strict';

var oo = require('substance/util/oo');
var Component = require('substance/ui/Component');
var $$ = Component.$$;

var UndoTool = require('substance/ui/UndoTool');
var RedoTool = require('substance/ui/RedoTool');
var SaveTool = require('substance/ui/SaveTool');

var TextTool = require('substance/packages/text/TextTool');
var StrongTool = require('substance/packages/strong/StrongTool');
var EmphasisTool = require('substance/packages/emphasis/EmphasisTool');
var EmbedTool = require('substance/packages/embed/EmbedTool');
var LinkTool = require('substance/packages/link/LinkTool');

var InsertFigureTool = require('substance/packages/figure/InsertFigureTool');
var ImageFigureCitationTool = require('../figures/ImageFigureCitationTool');
var BibItemCitationTool = require('../bibliography/BibItemCitationTool');

var Dropdown = require('substance/ui/Dropdown');
var Icon = require("substance/ui/FontAwesomeIcon");

function ContentToolbarComponent() {
  Component.apply(this, arguments);
}

ContentToolbarComponent.Prototype = function() {

  this.render = function() {
    var el = $$("div").addClass("content-tools-component toolbar toolbar-component small fill-white");
    el.append(
      $$('div').addClass('tool-group text clearfix').append(
        $$(TextTool)
      )
    );
    el.append(
      $$('div').addClass('tool-group document clearfix').append(
        $$(UndoTool).append($$(Icon, {icon: 'fa-undo'})),
        $$(RedoTool).append($$(Icon, {icon: 'fa-repeat'})),
        $$(SaveTool).append($$(Icon, {icon: 'fa-save'}))
      )
    );

    // Figure Actions
    // ------------------
    var figureActions = $$(Dropdown, {
      label: $$(Icon, {icon: "fa-image"}),
      title: this.i18n.t('figure')
    }).append(
      $$(InsertFigureTool).removeClass('tool').addClass('option').append(this.i18n.t('insert')),
      $$(ImageFigureCitationTool).addClass('option').append(this.i18n.t('cite'))
    );

    // Bibitem Actions
    // ------------------

    var bibitemActions = $$(Dropdown, {
      label: $$(Icon, {icon: 'fa-book'}),
      title: this.i18n.t('bib-item')
    }).append(
      $$(BibItemCitationTool).addClass('option').append(this.i18n.t('cite'))
    );

    el.append(
      $$('div').addClass('tool-group actions clearfix').append(
        figureActions,
        bibitemActions,
        $$(EmbedTool).append($$(Icon, {icon: 'fa-code'}))
      ),
      $$('div').addClass('tool-group formatting clearfix float-right').append(
        $$(StrongTool).append($$(Icon, {icon: 'fa-bold'})),
        $$(EmphasisTool).append($$(Icon, {icon: 'fa-italic'})),
        $$(LinkTool).append($$(Icon, {icon: 'fa-link'}))
      )
    );
    return el;
  };
};

oo.inherit(ContentToolbarComponent, Component);
module.exports = ContentToolbarComponent;
