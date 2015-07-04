'use strict';
var $$ = React.createElement;
var _ = require("substance/helpers");
var Icon = require("substance-ui/font_awesome_icon");

class CitePanel extends React.Component {

  constructor(props) {
    super(props);
  }

  handleCancel(e) {
    var app = this.context.app;
    e.preventDefault();

    app.replaceState({
      contextId: "toc"
    });
  }

  getItems(citationType) {
    var doc = this.props.doc;
    var collection = doc.getCollection(citationType);
    return collection.getItems();
  }

  stateFromAppState() {
    var app = this.context.app;
    this.state = {
      citationType: app.state.citationType,
      items: this.getItems(app.state.citationType),
      citationId: app.state.citationId
    };
  }

  componentWillMount() {
    this.stateFromAppState();
    this.tool = this.context.toolRegistry.get('cite');
    if (!this.tool) throw new Error('cite tool not found in registry');
  }

  componentWillReceiveProps() {
    this.stateFromAppState();
  }

  componentWillUnmount() {
    this.tool.disconnect(this);
  }

  // Determines wheter an item is active
  isItemActive(itemId) {
    if (!this.state.citationId) return false;
    var doc = this.props.doc;
    var citation = doc.get(this.state.citationId);
    return _.includes(citation.targets, itemId);
  }

  // Rendering
  // -------------------

  render() {
    var self = this;
    var componentRegistry = this.context.componentRegistry;

    var items = this.state.items;
    var itemEls;

    if (items.length > 0) {
      itemEls = items.map(function(item) {
        var comp = componentRegistry.get("_cite_" + this.state.citationType);
        return $$(comp, {
          key: item.id,
          node: item,
          active: this.isItemActive(item.id),
          handleSelection: self.handleSelection.bind(this)
        });
      }.bind(this));
    } else {
      itemEls = [$$('div', {className: "no-results", text: "Nothing to reference."})];
    }

    return $$("div", {className: "panel dialog cite-panel-component"},
      $$('div', {className: "dialog-header"},
        $$('a', {
          href: "#",
          className: 'back',
          onClick: this.handleCancel.bind(this),
        }, $$(Icon, {icon: 'fa-chevron-left'})),
        $$('div', {className: 'label'}, "Choose referenced items")
      ),

      $$('div', {className: "panel-content"},
        $$('div', {className: "bib-items"},
          itemEls
        )
      )
    );
  }

  // Called with entityId when an entity has been clicked
  handleSelection(targetId) {
    var citationId = this.state.citationId;
    this.tool.toggleTarget(citationId, targetId);
    this.forceUpdate();
  }
}

CitePanel.contextTypes = {
  app: React.PropTypes.object.isRequired,
  backend: React.PropTypes.object.isRequired,
  toolRegistry: React.PropTypes.object.isRequired,
  componentRegistry: React.PropTypes.object.isRequired
};

CitePanel.displayName = "CitePanel";

// Panel configuration
// ----------------

// CitePanel.contextId = "cite";
CitePanel.icon = "fa-bullseye";

// No context switch toggle is shown
CitePanel.isDialog = true;

module.exports = CitePanel;