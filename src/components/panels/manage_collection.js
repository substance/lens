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

  constructor(props) {
    super(props);
  }

  getChildContext() {
    return {
      surface: this.surface
    };
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

  componentDidMount() {
    var surface = this.surface;
    var app = this.context.app;
    // push surface selection state so that we can recover it when closing
    this.context.surfaceManager.pushState();

    app.registerSurface(surface, {
      enabledTools: [ENABLED_TOOLS]
    });

    surface.attach(React.findDOMNode(this.refs.collection));
    var self = this;

    // This needed?
    this.forceUpdate(function() {
      self.surface.rerenderDomSelection();
    });
  }


  componentDidUpdate() {
    // HACK: when the state is changed this and particularly TextProperties
    // get rerendered (e.g., as the highlights might have changed)
    // Unfortunately we loose the DOM selection then.
    // Thus, we are resetting it here, but(!) delayed as otherwise the surface itself
    // might not have finished setting the selection to the desired and a proper state.
    var self = this;
    setTimeout(function() {
      self.surface.rerenderDomSelection();
    });
  }

  componentWillUnmount() {
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

  render() {
    var state = this.state;
    var doc = this.context.app.doc;
    var navItems = _.map(CONTEXTS, function(context) {
      var classNames = ['pill'];
      return $$('button', {
        "data-id": context.contextId,
        className: classNames.join(' '),
        onClick: this.handleContextSwitch,
      }, $$(Icon, {icon: context.icon}), " "+context.label);
    }.bind(this));

    var itemEls;

    var componentRegistry = this.context.componentRegistry;
    var ItemClass = componentRegistry.get(this.state.itemType);

    if (state.items.length > 0 ) {
      itemEls = _.map(state.items, function(item) {
        return $$(ItemClass, {
          node: item,
          key: item.id,
          doc: doc
          // handleDeletion: this.handleItemDeletion.bind(this)
        });
      }, this);
    } else {
      itemEls = [$$('div', null, "No items found.")];
    }

    return $$('div', {classNames: 'manage-collection-component'},
      $$('div', {classNames: 'header toolbar clearfix menubar fill-light'},
        $$('div', {classNames: 'title float-left large'}, this.getPanelLabel()),
        $$('div', {classNames: 'menu-group small'}, navItems),
        $$('button', {classNames: 'button close-modal float-right'},
          $$(Icon, {icon: 'fa-close'})
        )
      ),

      $$('div', {
          key: 'collection',
          classNames: 'content collection',
          contentEditable: true
        },
        itemEls
      )
    );
  }
}

// Panel Configuration
// -----------------

ManageCollection.contextId = "manageCollection";
// ManageCollection.modalSize = "medium";

module.exports = ManageCollection;
