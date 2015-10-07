'use strict';

var Substance = require('substance');
var _ = Substance._;
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;
var Icon = require("substance/ui/font_awesome_icon");
var Surface = require("substance/ui/surface");

var ENABLED_TOOLS = ["strong", "emphasis", "comment"];

var CONTEXTS = [
  // {contextId: 'list', label: 'Upload figures', icon: 'fa-plus'}
];

function ManageCollection() {
  Component.apply(this, arguments);

  var doc = this.props.doc;
  // retrieve items from collection
  this.collection = doc.getCollection(this.props.itemType);
  
  // create surface
  var surfaceOptions = {
    name: 'collection',
    logger: this.context.notifications
  };
  this.surface = new Surface(this.context.surfaceManager, doc,
    new Surface.FormEditor(), surfaceOptions);

  this.childContext = {
    surface: this.surface
  };
}

ManageCollection.Prototype = function() {

  this.didMount = function() {
    var surface = this.surface;
    var app = this.context.app;
    // push surface selection state so that we can recover it when closing
    this.context.surfaceManager.pushState();
    surface.attach(this.refs.collection.$el[0]);
  };

  this.dispose = function() {
    this.surface.dispose();
    this.context.surfaceManager.popState();
  };

  this.render = function() {
    var doc = this.props.doc;
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
    var ItemClass = componentRegistry.get(this.props.itemType);

    var items = this.collection.getItems();
    if (items.length > 0 ) {
      itemEls = _.map(items, function(item) {
        return $$(ItemClass).key(item.id)
          .addProps({
            node: item,
            doc: doc
          });
      }, this);
    } else {
      itemEls = [$$('div').append(this.i18n.t("no_items_found"))];
    }

    return $$('div').addClass('manage-collection-component').append(
      $$('div').addClass('header toolbar clearfix menubar fill-light').append(
        $$('div').addClass('title float-left large')
          .append(this.getPanelLabel()),
        $$('div').addClass('menu-group small')
          .append(navItems),
        $$('button').addClass('button close-modal float-right')
          .append($$(Icon).addProps({icon: 'fa-close'}))
          .on('click', this.onCloseModal)
      ),
      $$('div').key('collection')
        .addClass('content collection')
        .attr('contentEditable', true)
        .append(itemEls)
    );
  };

  this.getPanelLabel = function() {
    var items = this.collection.getItems();
    var prefix = this.collection.labelPrefix;
    if (items.length > 1) prefix += 's';
    return [items.length, prefix].join(' ');
  };


  this.handleItemDeletion = function(itemId) {
    console.log('handling item deletion', itemId);
  };

  this.onCloseModal = function(e) {
    e.preventDefault();
    this.send('close-modal');
  };

};

OO.inherit(ManageCollection, Component);

// Panel Configuration
// -----------------

ManageCollection.contextId = "manageCollection";
// ManageCollection.modalSize = "medium";

module.exports = ManageCollection;
