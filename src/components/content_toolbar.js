"use strict";

var Substance = require('substance');
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;

var UndoTool = require('substance/ui/tools/undo_tool');
var RedoTool = require('substance/ui/tools/redo_tool');
var TextTool = require('substance/ui/tools/text_tool');
var StrongTool = require('substance/ui/tools/strong_tool');
var EmphasisTool = require('substance/ui/tools/emphasis_tool');
var LinkTool = require('substance/ui/tools/link_tool');

var Icon = require("substance/ui/font_awesome_icon");

// var CiteTool = require("./tools/cite_tool_component");

function ContentToolbarComponent() {
  Component.apply(this, arguments);
}

ContentToolbarComponent.Prototype = function() {

  this.render = function() {
    var el = $$("div").addClass("content-tools-component toolbar small fill-white");
    el.append(
      $$('div').addClass('tool-group text clearfix').append(
        $$(TextTool).addProps({ tool: 'text', title: i18n.t('menu.text_tool')})
      )
    );
    el.append(
      $$('div').addClass('tool-group document clearfix').append(
        $$(UndoTool).append($$(Icon, {icon: 'fa-undo'})),
        $$(RedoTool).append($$(Icon, {icon: 'fa-repeat'}))
      )
    );
    // Figure Actions
    // ------------------
    // var figureActions = $$(DropdownComponent).addProps({
    //     label: $$(Icon).addProps({icon: "fa-image"}),
    //     title: i18n.t('figure')
    //   }).append(
    //     $$(Tool)
    //       .addProps({ tool: 'insert_figure'})
    //       .addClass('option')
    //       .append("Insert"),
    //     $$(CiteTool)
    //       .addProps({ citationType: 'image_figure'})
    //       .addClass('option')
    //       .append("Cite"),
    //     $$(OpenModalTool)
    //       .addProps({
    //         contextId: 'manageCollection',
    //         itemType: 'image_figure',
    //         title: i18n.t('menu.manage')
    //       })
    // );

    // Table Actions
    // ------------------

    // var tableActions = $$(DropdownComponent)
    //   .addProps({
    //     label: $$(Icon).addProps({icon: "fa-table"}),
    //     title: i18n.t('table')
    //   })
    //   .addClass('table-dropdown')
    //   .append(
    //     $$(Tool)
    //       .addProps({ tool: 'insert_table'})
    //       .addClass('option')
    //       .append("Insert"),
    //     $$(CiteTool)
    //       .addProps({ citationType: 'table_figure'})
    //       .addClass('option')
    //       .append("Cite"),
    //     $$(OpenModalTool)
    //       .addProps({
    //         contextId: 'manageCollection',
    //         itemType: 'table_figure',
    //         title: i18n.t('menu.manage')
    //       }),
    //     $$("hr"),
    //     $$(TableTool)
    //       .addClass('option')
    //       .addProps({ tool: 'insert_columns', mode: "before"}),
    //     $$(TableTool)
    //       .addProps({ tool: 'delete_columns' })
    //       .addClass('option'),
    //     $$(TableTool)
    //       .addProps({ tool: 'insert_columns', mode: "after"})
    //       .addClass('option'),
    //     $$("hr"),
    //     $$(TableTool)
    //       .addProps({ tool: 'insert_rows', mode: "above"})
    //       .addClass('option'),
    //     $$(TableTool)
    //       .addProps({ tool: 'delete_rows' })
    //       .addClass('option'),
    //     $$(TableTool)
    //       .addProps({ tool: 'insert_rows', mode: "below"})
    //       .addClass('option')
    //   );

    // Bibitem Actions
    // ------------------

    // var bibitemActions = $$(DropdownComponent)
    //   .addProps({
    //     label: $$(Icon).addProps({icon: "fa-book"}),
    //     title: i18n.t('bibitem')
    //   })
    //   .append(
    //     $$(CiteTool)
    //       .addProps({ citationType: 'bib_item' })
    //       .addClass('option')
    //       .append("Cite"),
    //     $$(OpenModalTool)
    //       .addProps({
    //         contextId: 'manageBibItems',
    //         title: i18n.t('menu.manage')
    //       })
    //   );

    el.append(
      // $$('div').addClass('tool-group actions clearfix').append(
      //   figureActions,
      //   tableActions,
      //   bibitemActions
      // ),
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

