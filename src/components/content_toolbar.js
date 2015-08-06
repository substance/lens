"use strict";

var Component = require("substance/ui/component");
var ToolComponent = require("substance/ui/tools/tool_component");
var TextToolComponent = require("substance/ui/tools/text_tool_component");
var TableToolComponent = require("substance/ui/tools/table_tool_component");
var DropdownComponent = require("substance/ui/dropdown_component");
var Icon = require("substance/ui/font_awesome_icon");

var CiteToolComponent = require("./tools/cite_tool_component");
var NavigateTool = require("./tools/navigate_tool_component");

var $$ = Component.$$;

class ContentToolbarComponent extends Component {

  render() {
    return $$("div", { classNames: "content-tools-component toolbar small fill-white" },
      $$('div', {classNames: 'tool-group text clearfix'},
        $$(TextToolComponent, { tool: 'text', title: i18n.t('menu.text_tool')})
      ),
      $$('div', {classNames: 'tool-group document clearfix'},
        $$(ToolComponent, { tool: 'undo', title: i18n.t('menu.undo'), classNames: 'button tool'}, $$(Icon, {icon: "fa-undo"})),
        $$(ToolComponent, { tool: 'redo', title: i18n.t('menu.redo'), classNames: 'button tool'}, $$(Icon, {icon: "fa-repeat"})),
        // $$(ToolComponent, { tool: 'save', title: i18n.t('menu.save'), classNames: 'button tool'}, $$(Icon, {icon: "fa-save"})),
        $$(ToolComponent, { tool: 'export', title: i18n.t('menu.export'), classNames: 'button tool'}, $$(Icon, {icon: "fa-download"}))
      ),

      $$('div', {classNames: 'tool-group actions clearfix'},
        // Figure Actions
        // ------------------
        $$(DropdownComponent, { label: $$(Icon, {icon: "fa-image"}), title: i18n.t('figure')},
          $$(ToolComponent, { tool: 'insert_figure', classNames: 'option'}, "Insert"),
          $$(CiteToolComponent, { citationType: 'image_figure', classNames: 'option'}, "Cite"),
          $$(NavigateTool, { newState: {modal: {contextId: 'manageCollection', itemType: 'image_figure'}}, title: i18n.t('menu.manage')})
        ),
        // Table Actions
        // ------------------
        $$(DropdownComponent, { label: $$(Icon, {icon: "fa-table"}), title: i18n.t('table'), classNames: 'table-dropdown'},
          $$(ToolComponent, { tool: 'insert_table', classNames: 'option'}, "Insert"),
          $$(CiteToolComponent, { citationType: 'table_figure', classNames: 'option'}, "Cite"),
          $$(NavigateTool, { newState: {modal: {contextId: 'manageCollection', itemType: 'table_figure'}}, title: i18n.t('menu.manage')}),
          $$("hr"),
          $$(TableToolComponent, { tool: 'insert_columns', classNames: 'option', mode: "before"}),
          $$(TableToolComponent, { tool: 'delete_columns', classNames: 'option'}),
          $$(TableToolComponent, { tool: 'insert_columns', classNames: 'option', mode: "after"}),
          $$("hr"),
          $$(TableToolComponent, { tool: 'insert_rows', classNames: 'option', mode: "above"}),
          $$(TableToolComponent, { tool: 'delete_rows', classNames: 'option'}),
          $$(TableToolComponent, { tool: 'insert_rows', classNames: 'option', mode: "below"})
        ),
        // Bibitem Actions
        // ------------------
        $$(DropdownComponent, { label: $$(Icon, {icon: "fa-book"}), title: i18n.t('bibitem')},
          $$(CiteToolComponent, { citationType: 'bib_item', classNames: 'option'}, "Cite"),
          $$(NavigateTool, { newState: {modal: {contextId: 'manageBibItems'}}, title: i18n.t('menu.manage')})
        )
      ),

      $$('div').addClass('tool-group formatting clearfix float-right').append(
        $$(ToolComponent)
          .addClass('button tool').append($$(Icon, {icon: "fa-italic"}))
          .addProps({ tool: 'emphasis', title: i18n.t('menu.emphasis')}),
        $$(ToolComponent)
          .addClass('button tool').append($$(Icon, {icon: "fa-bold"}))
          .addProps({ tool: 'strong', title: i18n.t('menu.strong') })
      )
    );
  }
}

module.exports = ContentToolbarComponent;

