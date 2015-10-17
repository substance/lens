var commands = {
  controller: [
    require('substance/ui/commands/undo'),
    require('substance/ui/commands/redo'),
    require('substance/ui/commands/save'),
  ],
  main: [
    // Core-commands (this should live be on everywhere)
    // maybe directly register on Surface
    require('substance/ui/commands/select_all'),

    // Special commands
    require('substance/ui/commands/embed'),
    require('substance/ui/commands/make_paragraph'),
    require('substance/ui/commands/make_heading1'),
    require('substance/ui/commands/make_heading2'),
    require('substance/ui/commands/make_heading3'),
    require('substance/ui/commands/switch_text_type'),
    require('substance/ui/commands/make_blockquote'),
    require('substance/ui/commands/make_codeblock'),
    require('substance/ui/commands/toggle_strong'),
    require('substance/ui/commands/toggle_emphasis'),
    require('substance/ui/commands/toggle_link'),

    // Insert figure
    require('./insert_figure'),
    require('./toggle_bib_item_citation'),
    require('./toggle_image_figure_citation')
  ],
  title: [
    require('substance/ui/commands/toggle_emphasis')
  ]
};

module.exports = commands;