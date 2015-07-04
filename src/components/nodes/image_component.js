'use strict';

var $$ = React.createElement;

class ImageComponent extends React.Component {

  componentWillMount() {
    var doc = this.props.doc;
    doc.connect(this, { 'document:changed': this.handleDocumentChange });
  }

  componentWillUnmount() {
    var doc = this.props.doc;
    doc.disconnect(this);
  }

  render() {

    return $$('div', {className: 'image', contentEditable: false, "data-id": this.props.node.id},
      $$('img', {src: this.props.node.src })
    );
  }

  handleDocumentChange(change) {
    if (change.isAffected([this.props.node.id, "src"])) {
      this.forceUpdate();
    }
  }
}

ImageComponent.displayName = "ImageComponent";


module.exports = ImageComponent;
