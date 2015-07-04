'use strict';

var _ = require("substance/helpers");
var $$ = React.createElement;
var Icon = require("substance-ui/font_awesome_icon");

var Substance = require("substance");
var Surface = Substance.Surface;
var ContainerEditor = Surface.ContainerEditor;

// var FormEditor = Surface.FormEditor;

var ENABLED_TOOLS = ["strong", "emphasis", "comment"];

var CONTEXTS = [
  // {contextId: 'list', label: 'Upload figures', icon: 'fa-plus'}
];

class ManageCollection extends React.Component {
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

  componentWillMount() {
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

    return $$('div', {className: 'manage-collection-component'},
      $$('div', {className: 'header toolbar clearfix menubar fill-light'},
        $$('div', {className: 'title float-left large'}, this.getPanelLabel()),
        $$('div', {className: 'menu-group small'}, navItems),
        $$('button', {className: 'button close-modal float-right'}, $$(Icon, {icon: 'fa-close'}))
      ),

      $$('div', {className: 'content collection', ref: 'collection', contentEditable: true},
        itemEls
      )
    );
  }
}

ManageCollection.displayName = "ManageCollection";

ManageCollection.contextTypes = {
  app: React.PropTypes.object.isRequired,
  componentRegistry: React.PropTypes.object.isRequired,
  surfaceManager: React.PropTypes.object.isRequired
};

ManageCollection.childContextTypes = {
  // provided to editor components so that they know in which context they are
  surface: React.PropTypes.object
};

// Panel Configuration
// -----------------

ManageCollection.contextId = "manageCollection";
// ManageCollection.modalSize = "medium";

module.exports = ManageCollection;