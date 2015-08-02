'use strict';

// i18n
require('./i18n/load');

// Substance Journal
// ---------------
//
// Main entry point of the Substance Journal web client

var Component = require("substance/ui/component");
var $$ = Component.$$;

var Backend = require("./backend");
var NotificationService = require("./notification_service");
var CrossrefSearch = require('../lib/article/bib/crossref_search');
var ScienceWriter = require("../src/science_writer");

class App extends Component.Root {

  constructor(props) {
    super(props);

    this.backend = new Backend();
    this.notifications = new NotificationService();

    this.childContext = {
      backend: this.backend,
      notifications: this.notifications,
      bibSearchEngines: [new CrossrefSearch()],
    };
  }

  render() {
    return $$(ScienceWriter, { key: 'writer' });
  }

  didMount() {
    var self = this;
    this.backend.getDocument('sample', function(err, doc) {
      self.refs.writer.setProps({doc: doc});
    });
  }
}

$(function() {
  new App().mount($('container'));
});
