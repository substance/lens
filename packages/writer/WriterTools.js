'use strict';

var Toolbar = require('substance/ui/Toolbar');
var Component = require('substance/ui/Component');
var $$ = Component.$$;
var SwitchTextTypeTool = require('substance/packages/text/SwitchTextTypeTool');
var UndoTool = require('substance/ui/UndoTool');
var RedoTool = require('substance/ui/RedoTool');
var SaveTool = require('substance/ui/SaveTool');
var StrongTool = require('substance/packages/strong/StrongTool');
var SubscriptTool = require('substance/packages/subscript/SubscriptTool');
var SuperscriptTool = require('substance/packages/superscript/SuperscriptTool');
var CodeTool = require('substance/packages/code/CodeTool');
var EmphasisTool = require('substance/packages/emphasis/EmphasisTool');
var Icon = require('substance/ui/FontAwesomeIcon');
var EmbedTool = require('substance/packages/embed/EmbedTool');
var LinkTool = require('substance/packages/link/LinkTool');
var InsertFigureTool = require('substance/packages/figure/InsertFigureTool');
var ImageFigureCitationTool = require('../figures/ImageFigureCitationTool');
var BibItemCitationTool = require('../bibliography/BibItemCitationTool');

function WriterTools() {
  WriterTools.super.apply(this, arguments);
}

WriterTools.Prototype = function() {

  this.render = function() {
    return $$('div').append(
      $$(Toolbar.Group).append(
        $$(SwitchTextTypeTool)
      ),
      $$(Toolbar.Group).append(
        $$(UndoTool).append($$(Icon, {icon: 'fa-undo'})),
        $$(RedoTool).append($$(Icon, {icon: 'fa-repeat'})),
        $$(SaveTool).append($$(Icon, {icon: 'fa-save'}))
      ),
      $$(Toolbar.Dropdown, {label: $$(Icon, {icon: 'fa-image'}),}).append(
        $$(InsertFigureTool).removeClass('tool').addClass('option').append(this.i18n.t('insert')),
        $$(ImageFigureCitationTool).append(this.i18n.t('cite'))
      ),
      $$(Toolbar.Dropdown, {label: $$(Icon, {icon: 'fa-book'}),}).append(
        $$(BibItemCitationTool).append(this.i18n.t('cite'))
      ),
      $$(Toolbar.Group).append(
        $$(EmbedTool).append($$(Icon, {icon: 'fa-file-code-o'}))
      ),
      $$(Toolbar.Group).addClass('float-right').append(
        $$(StrongTool).append($$(Icon, {icon: 'fa-bold'})),
        $$(EmphasisTool).append($$(Icon, {icon: 'fa-italic'})),
        $$(LinkTool).append($$(Icon, {icon: 'fa-link'})),
        $$(SubscriptTool).append($$(Icon, {icon: 'fa-subscript'})),
        $$(SuperscriptTool).append($$(Icon, {icon: 'fa-superscript'})),
        $$(CodeTool).append($$(Icon, {icon: 'fa-code'}))
      )
    );
  };
};

Component.extend(WriterTools);

module.exports = WriterTools;
