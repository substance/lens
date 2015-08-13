// HACK: remember previous selection so we can check if a selection has changed
var prevSelection;

var stateHandlers = {

  handleSelectionChange: function(writer, surface, sel) {
    if (surface.name !== "main") return;
    if (sel.isNull() || !sel.isPropertySelection()) {
      return;
    }
    if (sel.equals(prevSelection)) {
      return;
    }
    prevSelection = sel;
    var doc = surface.getDocument();
    var state = writer.getState();
    var citations = doc.annotationIndex.get(sel.getPath(), sel.getStartOffset(), sel.getEndOffset(), "citation");
    if (citations.length === 1) {
      var citation = citations[0];
      if (citation.getSelection().equals(sel)) {
        var citationType = citation.type.replace("_citation", "");
        // Show cite panel in edit mode
        writer.setState({
          contextId: "cite_"+citationType,
          citationType: citationType,
          citationId: citation.id
        });
        return true;
      }
    }
    if (state.contextId !== "toc") {
      writer.setState({
        contextId: 'toc'
      });
    }
  },

  // Determine highlighted nodes
  // -----------------
  //
  // => inspects state
  //
  // TODO: this is potentially called too often
  //
  // Based on app state, determine which nodes should be highlighted in the content panel
  // @returns a list of nodes to be highlighted

  getHighlightedNodes: function(writer) {
    var doc = writer.getDocument();
    var state = writer.getState();
    var highlightedNodes = [];
    if (state.citationId) {
      var citation = doc.get(state.citationId);
      // HACK: when typing over a selected citation
      // it happens that the citation is gone while
      // its id is still in this state.
      if (citation) {
        highlightedNodes.push(state.citationId);
        // Highlight targets of a selected citation
        highlightedNodes = highlightedNodes.concat(citation.targets);
      }
    }
    if (highlightedNodes.length > 0) return highlightedNodes;
  }

};

module.exports = stateHandlers;