'use strict';

var _ = require('substance/util/helpers');
var oo = require('substance/util/oo');
var Component = require('substance/ui/Component');
var Panel = require('substance/ui/Panel');
var Icon = require("substance/ui/FontAwesomeIcon");
var SmartReferenceItem = require("./SmartReferenceItem")
var uuid = require('substance/util/uuid');

var $$ = Component.$$;

function SmartReferencesPanel() {
  Panel.apply(this, arguments);
  this._initialize(this.props);
}

SmartReferencesPanel.Prototype = function() {

  this.render = function() {

    var items = this.props.results.map(function (result) {
      return $$(SmartReferenceItem, {
        node: result,
        handleSelection: this.handleSelection.bind(this)
      })
    }.bind(this))

    return $$('div').addClass("panel dialog cite-panel-component").append(
      $$('div').addClass("dialog-header").append(
        $$('a').addClass('back').attr('href', '#')
          .on('click', this.handleCancel)
          .append($$(Icon, {icon: 'fa-chevron-left'})),
        $$('div').addClass('label').append(this.i18n.t("choose_referenced_items"))
      ),
      $$('div').addClass("panel-content").ref('panelContent').append(
        $$('div').addClass("bib-items border-bottom pad item small clearfix").append('Searched for: ' + this.props.query.join(' ') + '. ' + this.props.results.length + ' papers.'),
        $$('div').addClass("bib-items").append(
          items
        )
      )
    );
  };

  this.willReceiveProps = function(nextProps) {
    // this._initialize(nextProps);
  };

  this._initialize = function() {
    // this.items = this.getItems(this.props.citationType);
  };

  this.dispose = function() {
    this.$el.off('click', '.back', this.handleCancel);
  };

  this.didMount = function() {
    // var citationTargetId = this.getFirstCitationTarget();
    // if (citationTargetId) {
    //   this.scrollToNode(citationTargetId);
    // }
  };

  this.getFirstCitationTarget = function() {
    // var doc = this.props.doc;
    // var citation = doc.get(this.props.citationId);
    // return citation.targets[0];
  };

  // Determines wheter an item is active
  this.isItemActive = function(itemId) {
    // if (!this.props.citationId) return false;
    // var doc = this.props.doc;
    // var citation = doc.get(this.props.citationId);
    // return _.includes(citation.targets, itemId);
  };

  this.handleCancel = function(e) {
    e.preventDefault();
    this.send("switchContext", "toc");
  };

  this.getItems = function(citationType) {
    // var doc = this.props.doc;
    // var collection = doc.getCollection(citationType);
    // return collection.getItems();
  };

  // Called with a new bibliography entry
  this.handleSelection = function(bib) {
    var bibId = uuid('bib')
    var surface = this.getController().getSurface()
    var op = this.props.op

    // Get the correct Citeproc format
    fetch('http://api.crossref.org/works/' + bib.DOI + '/transform/application/vnd.citationstyles.csl+json')
    .then(function (response) {
      return response.json()
    }).then(function (data) {
      surface.transaction(function(tx, args) {

        var bibItem = {
          id: bibId,
          type: "bib-item",
          source: JSON.stringify(data),
          format: 'citeproc'
        };
        tx.create(bibItem);

        // args.text = '$';
        // surface.insertText(tx, args);

        tx.create({
          id: uuid('bib'),
          'type': 'bib-item-citation',
          'targets': [bibItem.id],
          'path': op.path,
          'startOffset': args.selection.startOffset,
          'endOffset': args.selection.startOffset + 1,
        })
      })
    })
  };
};

oo.inherit(SmartReferencesPanel, Panel);

// Panel configuration
// ----------------

SmartReferencesPanel.icon = "fa-bullseye";

// No context switch toggle is shown
SmartReferencesPanel.isDialog = true;

module.exports = SmartReferencesPanel;
