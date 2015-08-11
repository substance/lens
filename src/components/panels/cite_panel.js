'use strict';

var _ = require("substance/helpers");
var Component = require('substance/ui/component');
var Icon = require("substance/ui/font_awesome_icon");
var $$ = Component.$$;

class CitePanel extends Component {

  constructor(parent, props) {
    super(parent, props);
  }

  render() {
    var componentRegistry = this.context.componentRegistry;
    var items;
    if (this.state.items.length > 0) {
      items = this.state.items.map(function(item) {
        var comp = componentRegistry.get("_cite_" + this.state.citationType);
        return $$(comp).key(item.id).addProps({
          node: item,
          active: this.isItemActive(item.id),
        });
      }.bind(this));
    } else {
      items = [$$('div').addClass("no-results").append("Nothing to reference.")];
    }
    return $$('div').addClass("panel dialog cite-panel-component").append(
      $$('div').addClass("dialog-header").append(
        $$('a').addClass('back').attr('href', '#')
          .on('click', this.handleCancel)
          .append($$(Icon).addProps({icon: 'fa-chevron-left'})),
        $$('div').addClass('label').append("Choose referenced items")
      ),
      $$('div').addClass("panel-content").append(
        $$('div').addClass("bib-items").append(
          items
        )
      )
    );
  }

  didMount() {
    this.stateFromAppState();
    this.tool = this.context.toolRegistry.get('cite');
    if (!this.tool) throw new Error('cite tool not found in registry');
  }

  willReceiveProps() {
    this.stateFromAppState();
  }

  willUnmount() {
    this.$el.off('click', '.back', this.handleCancel);
    this.tool.disconnect(this);
  }

  // Determines wheter an item is active
  isItemActive(itemId) {
    if (!this.state.citationId) return false;
    var doc = this.props.doc;
    var citation = doc.get(this.state.citationId);
    return _.includes(citation.targets, itemId);
  }

  handleCancel(e) {
    e.preventDefault();
    this.send("switchContext", "toc");
  }

  getItems(citationType) {
    var doc = this.props.doc;
    var collection = doc.getCollection(citationType);
    return collection.getItems();
  }

  // TODO: this is not good. It is not at all clear how this
  // panel is coupled with app... IMO it should not be coupled this way
  stateFromAppState() {
    console.error('FIXME');
    return;
    var app = this.context.app;
    this.state = {
      citationType: app.state.citationType,
      items: this.getItems(app.state.citationType),
      citationId: app.state.citationId
    };
  }

  // Called with entityId when an entity has been clicked
  handleSelection(targetId) {
    var citationId = this.state.citationId;
    this.tool.toggleTarget(citationId, targetId);
    this.rerender();
  }
}

// Panel configuration
// ----------------

CitePanel.icon = "fa-bullseye";

// No context switch toggle is shown
CitePanel.isDialog = true;

module.exports = CitePanel;
