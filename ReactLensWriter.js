var React = require('react');
var LensWriter = require('./LensWriter');
var Component = require('substance/ui/Component');
var $$ = Component.$$;
var LensArticleExporter = require('./model/LensArticleExporter');
var LensArticleImporter = require('./model/LensArticleImporter');

var exporter = new LensArticleExporter();
var importer = new LensArticleImporter();

// LensWriter wrapped in a React component
// ------------------

var ReactLensWriter = React.createClass({

  getWriter: function() {
    return this;
  },

  // Delegators
  _onSave: function(doc, changes, cb) {
    var xml = exporter.exportDocument(doc);
    this.props.onSave(xml, cb);
  },

  _onUploadFile: function(file, cb) {
    this.props.onUploadFile(file, cb);
  },

  getContent: function() {
    var doc = this.writer.getDocument();
    var xml = exporter.exportDocument(doc);
    return xml;
  },

  // New props arrived, update the editor
  componentDidUpdate: function() {
    var doc = this.createDoc(this.props.content);
    this.writer.extendProps({
      doc: doc
    });
  },

  createDoc: function(xmlContent) {
    var doc = importer.importDocument(xmlContent);
    return doc;
  },

  componentDidMount: function() {
    var el = React.findDOMNode(this);
    var doc = this.createDoc(this.props.content);
    
    this.writer = Component.mount(LensWriter, {
      doc: doc,
      onSave: this._onSave,
      onUploadFile: this._onUploadFile
    }, el);
  },

  componentWillUnmount: function() {
    this.writer.dispose();
  },

  render: function() {
    return React.DOM.div({
      className: 'lens-writer-wrapper'
    });
  }
});

ReactLensWriter.propTypes = {
  content: React.PropTypes.string // XML source of the document
};

module.exports = ReactLensWriter;
