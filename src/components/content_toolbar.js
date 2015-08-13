"use strict";

var Substance = require('substance');
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;

var ToolComponent = require("substance/ui/tools/tool_component");
var TextToolComponent = require("substance/ui/tools/text_tool_component");
var TableToolComponent = require("substance/ui/tools/table_tool_component");
var DropdownComponent = require("substance/ui/dropdown_component");
var Icon = require("substance/ui/font_awesome_icon");

var CiteToolComponent = require("./tools/cite_tool_component");
var NavigateTool = require("./tools/navigate_tool_component");

function ContentToolbarComponent() {
  Component.apply(this, arguments);
}

ContentToolbarComponent.Prototype = function() {

  this.render = function() {
    var el = $$("div").addClass("content-tools-component toolbar small fill-white");
    el.append(
      $$('div').addClass('tool-group text clearfix').append(
        $$(TextToolComponent).addProps({ tool: 'text', title: i18n.t('menu.text_tool')})
      )
    );
    el.append(
      $$('div').addClass('tool-group document clearfix').append(
        $$(ToolComponent)
          .addClass('button tool')
          .addProps({
            tool: 'undo',
            title: i18n.t('menu.undo')
          })
          .append($$(Icon).addProps({icon: "fa-undo"})),
        $$(ToolComponent)
          .addProps({ tool: 'redo', title: i18n.t('menu.redo')})
          .addClass('button tool')
          .append($$(Icon).addProps({icon: "fa-repeat"})),
        $$(ToolComponent)
          .addProps({ tool: 'export', title: i18n.t('menu.export') })
          .addClass('button tool')
          .append($$(Icon).addProps({icon: "fa-download"}))
      )
    );
    // Figure Actions
    // ------------------
    var figureActions = $$(DropdownComponent).addProps({
        label: $$(Icon).addProps({icon: "fa-image"}),
        title: i18n.t('figure')
      }).append(
        $$(ToolComponent)
          .addProps({ tool: 'insert_figure'})
          .addClass('option')
          .append("Insert"),
        $$(CiteToolComponent)
          .addProps({ citationType: 'image_figure'})
          .addClass('option')
          .append("Cite"),
        $$(NavigateTool)
          .addProps({
            newState: {
              modal: {
                contextId: 'manageCollection',
                itemType: 'image_figure'
              }
            },
            title: i18n.t('menu.manage')
          })
    );

    // Table Actions
    // ------------------
    var tableActions = $$(DropdownComponent)
      .addProps({
        label: $$(Icon).addProps({icon: "fa-table"}),
        title: i18n.t('table')
      })
      .addClass('table-dropdown')
      .append(
        $$(ToolComponent)
          .addProps({ tool: 'insert_table'})
          .addClass('option')
          .append("Insert"),
        $$(CiteToolComponent)
          .addProps({ citationType: 'table_figure'})
          .addClass('option')
          .append("Cite"),
        $$(NavigateTool)
          .addProps({
            newState: {
              modal: {
                contextId: 'manageCollection',
                itemType: 'table_figure'
              }
            },
            title: i18n.t('menu.manage')
          }),
        $$("hr"),
        $$(TableToolComponent)
          .addClass('option')
          .addProps({ tool: 'insert_columns', mode: "before"}),
        $$(TableToolComponent)
          .addProps({ tool: 'delete_columns' })
          .addClass('option'),
        $$(TableToolComponent)
          .addProps({ tool: 'insert_columns', mode: "after"})
          .addClass('option'),
        $$("hr"),
        $$(TableToolComponent)
          .addProps({ tool: 'insert_rows', mode: "above"})
          .addClass('option'),
        $$(TableToolComponent)
          .addProps({ tool: 'delete_rows' })
          .addClass('option'),
        $$(TableToolComponent)
          .addProps({ tool: 'insert_rows', mode: "below"})
          .addClass('option')
      );

    // Bibitem Actions
    // ------------------
    var bibitemActions = $$(DropdownComponent)
      .addProps({
        label: $$(Icon).addProps({icon: "fa-book"}),
        title: i18n.t('bibitem')
      })
      .append(
        $$(CiteToolComponent)
          .addProps({ citationType: 'bib_item' })
          .addClass('option')
          .append("Cite"),
        $$(NavigateTool)
          .addProps({
            newState: {
              modal: {
                contextId: 'manageBibItems'
              }
            },
            title: i18n.t('menu.manage')
          })
      );

    el.append(
      $$('div').addClass('tool-group actions clearfix').append(
        figureActions,
        tableActions,
        bibitemActions
      ),
      $$('div').addClass('tool-group formatting clearfix float-right').append(
        $$(ToolComponent)
          .addClass('button tool')
          .addProps({ tool: 'emphasis', title: i18n.t('menu.emphasis')})
          .append($$(Icon).addProps({icon: "fa-italic"})),
        $$(ToolComponent)
          .addClass('button tool')
          .addProps({ tool: 'strong', title: i18n.t('menu.strong') })
          .append($$(Icon).addProps({icon: "fa-bold"}))
      )
    );
    return el;
  };
};

OO.inherit(ContentToolbarComponent, Component);

module.exports = ContentToolbarComponent;

