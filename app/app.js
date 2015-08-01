'use strict';

// i18n
require('./i18n/load');

// Substance Journal
// ---------------
//
// Main entry point of the Substance Journal web client

var _ = require("substance/helpers");
var Component = require("substance/ui/component");
var $$ = Component.$$;

// Specify a backend
// ---------------
//

var Backend = require("./backend");
var backend = new Backend();

// Specify a notification service
// ---------------
//
// This is used for user notifications, displayed in the status bar

var NotificationService = require("./notification_service");
var notifications = new NotificationService();
var CrossrefSearch = require('../lib/article/bib/crossref_search');

// React Components
// ---------------
//

// Available contexts
var ScienceWriter = require("../src/science-writer");

// Top Level Application
// ---------------
//

class App extends Component.Root {

  constructor(props) {
    super(props)

    this.childContext = {
      backend: backend,
      bibSearchEngines: [new CrossrefSearch()],
      notifications: notifications,
    }
  }

  render() {
    return $$(ScienceWriter, {
      documentId: "sample"
    });
  }
}

$(function() {
  new App().mount($('container'));
});

