'use strict';

var _ = require("substance/helpers");
var Component = require('substance/ui/component');
var $$ = Component.$$;
var Icon = require("substance/ui/font_awesome_icon");
var Surface = require("substance/surface");

// var FormEditor = Surface.FormEditor;

var ENABLED_TOOLS = ["strong", "emphasis", "comment"];

var CONTEXTS = [
  // {contextId: 'list', label: 'Upload figures', icon: 'fa-plus'}
];

class ManageCollection extends Component {

  get childContext() {
    return {
      surface: this.surface
    };
  }

  render() {
    var state = this.state;
    var doc = this.context.app.doc;
    var navItems = _.map(CONTEXTS, function(context) {
      return $$('button').addClass('pill')
        .attr("data-id", context.contextId)
        .on('click', this.handleContextSwitch)
        .append(
          $$(Icon).addProps({icon: context.icon}).append(" "+context.label)
        );
    }.bind(this));

    var itemEls;
    var componentRegistry = this.context.componentRegistry;
    var ItemClass = componentRegistry.get(this.state.itemType);

    if (state.items.length > 0 ) {
      itemEls = _.map(state.items, function(item) {
        return $$(ItemClass).key(item.id)
          .addProps({
            node: item,
            doc: doc
          });
      }, this);
    } else {
      itemEls = [$$('div').append("No items found.")];
    }

    return $$('div').addClass('manage-collection-component').append(
      $$('div').addClass('header toolbar clearfix menubar fill-light').append(
        $$('div').addClass('title float-left large')
          .append(this.getPanelLabel()),
        $$('div').addClass('menu-group small')
          .append(navItems),
        $$('button').addClass('button close-modal float-right')
          .append($$(Icon).addProps({icon: 'fa-close'})
        )
      ),
      $$('div').key('collection')
        .addClass('content collection')
        .attr('contentEditable', true)
        .append(itemEls)
    );
  }


  stateFromAppState() {
    var app = this.context.app;
    var doc = this.context.app.doc;
    var itemType = app.state.modal.itemType;
    var collection = doc.getCollection(itemType);
    this.state = {
      itemType: itemType,
      collection: collection,
      items: collection.getItems()
    };
  }

  getPanelLabel() {
    var c = this.state.collection;
    return [this.state.items.length, c.labelPrefix+'s'].join(' ');
  }

  didReceiveProps() {
    this.stateFromAppState();
    var doc = this.context.app.doc;
    var options = {
      name: 'collection',
      logger: this.context.notifications
    };
    this.surface = new Surface(this.context.surfaceManager, doc, new Surface.FormEditor(), options);
  }

  didMount() {
    var surface = this.surface;
    var app = this.context.app;
    // push surface selection state so that we can recover it when closing
    this.context.surfaceManager.pushState();
    app.registerSurface(surface, {
      enabledTools: [ENABLED_TOOLS]
    });
    surface.attach(React.findDOMNode(this.refs.collection));
  }

  willUnmount() {
    var app = this.context.app;
    var surface = this.surface;
    // remove the selection explicitly so that we don't have a tool
    // attached to this surface afterwards
    app.unregisterSurface(surface);
    surface.dispose();
    this.context.surfaceManager.popState();
  }

  handleItemDeletion(itemId) {
    console.log('handling item deletion', itemId);
  }
}

// Panel Configuration
// -----------------

ManageCollection.contextId = "manageCollection";
// ManageCollection.modalSize = "medium";

module.exports = ManageCollection;
