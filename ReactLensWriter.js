var React = require('react');
var LensWriter = require('./LensWriter');
var Article = require('./model/LensArticle');
var Component = require('substance/ui/Component');
var $$ = Component.$$;

// LensWriter wrapped in a React component
// ------------------

var ReactLensWriter = React.createClass({

  getWriter: function() {
    return this;
  },

  // Delegators
  _onSave: function(doc, changes, cb) {
    var xml = doc.toXml();
    this.props.onSave(xml, cb);
  },

  _onFileUpload: function(file, cb) {
    this.props.onFileUpload(file, cb);
  },

  getContent: function() {
    return this.writer.getDocument().toXml();
  },

  // New props arrived, update the editor
  componentDidUpdate: function() {
    var doc = this.createDoc(this.props.content);
    this.writer.extendProps({
      doc: doc
    });
  },

  createDoc: function(content) {
    return Article.fromXml(content || Article.XML_TEMPLATE);
  },

  componentDidMount: function() {
    var el = React.findDOMNode(this);
    var doc = this.createDoc(this.props.content);
    this.writer = Component.mount($$(LensWriter, {
      doc: doc,
      onSave: this._onSave,
      onFileUpload: this._onFileUpload
    }), el);
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