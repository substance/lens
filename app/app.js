'use strict';

// i18n
require('./i18n/load');

// Substance Journal
// ---------------
//
// Main entry point of the Substance Journal web client

var _ = require("substance/helpers");
var $$ = React.createElement;

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
var ScienceWriter = require("../src");

// Top Level Application
// ---------------
//

var App = React.createClass({
  displayName: "App",

  childContextTypes: {
    backend: React.PropTypes.object,
    notifications: React.PropTypes.object,
    bibSearchEngines: React.PropTypes.array
  },

  getChildContext: function() {
    return {
      backend: backend,
      bibSearchEngines: [new CrossrefSearch()],
      notifications: notifications,      
    };
  },

  render: function() {
    return $$(ScienceWriter, {
      documentId: "sample"
    });
  }
});

// Start the app

$(function() {
  React.render(
    $$(App, {
      route: window.location.hash.slice(1)
    }),
    document.getElementById('container')
  );
});

