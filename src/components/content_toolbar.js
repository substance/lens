"use strict";

var Substance = require('substance');
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;

var UndoTool = require('substance/ui/tools/undo_tool');
var RedoTool = require('substance/ui/tools/redo_tool');
var SaveTool = require('substance/ui/tools/save_tool');
var TextTool = require('substance/ui/tools/text_tool');
var StrongTool = require('substance/ui/tools/strong_tool');
var EmphasisTool = require('substance/ui/tools/emphasis_tool');
var EmbedTool = require('substance/ui/tools/embed_tool');
var LinkTool = require('substance/ui/tools/link_tool');

var InsertFigureTool = require('../tools/insert_figure');
var ToggleImageFigureCitation = require('../tools/toggle_image_figure_citation');

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
        $$(ToggleImageFigureCitation).addClass('option').append(this.i18n.t('cite'))
    );

    // Bibitem Actions
    // ------------------

    var bibitemActions = $$(Dropdown, {
      label: $$(Icon, {icon: 'fa-book'}),
      title: this.i18n.t('bib_item')
    }).append(
      $$(ToggleImageFigureCitation).addClass('option').append(this.i18n.t('cite'))
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

OO.inherit(ContentToolbarComponent, Component);

module.exports = ContentToolbarComponent;

