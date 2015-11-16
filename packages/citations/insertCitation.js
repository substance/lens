var insertText = require('substance/model/transform/insertText');
var createAnnotation = require('substance/model/transform/createAnnotation');

/**
  Transformation for inserting a citation at a given selection.

  @param {model/TransactionDocument} tx the document instance to manipulate
  @param {model/Selection} selection
  @param {String} citationType type of created citation (e.g, 'bib-item-citation', see {@link packages/bibliography/BibItemCitation})
  @param {Array<String>} targets an array of target ids (e.g., ids of bib-items)

*/
function insertCitation(tx, selection, citationType, targets) {
  // Insert fake character where the citation should stick on
  var out = insertText(tx, {
    selection: selection,
    text: "\u200B"
  });
  selection = out.selection;
  // make a selection spanning the inserted character
  selection = tx.createSelection({
    type: 'property',
    path: selection.path,
    startOffset: selection.startOffset-1,
    endOffset: selection.endOffset
  });
  // create a citation annotation
  out = createAnnotation(tx, {
    selection: selection,
    annotationType: citationType,
    annotationData: {
      targets: targets
    }
  });
  var citation = out.result;
  return {
    selection: selection,
    citation: citation
  };
}

module.exports = insertCitation;