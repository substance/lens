'use strict';

/*
  HTML converter for Paragraph.

  Markup:

  ```
  <meta>
    <title>The <em>Substance</em> Article Format</title>
    <abstract>Article abstract with <strong>annotations</strong></abstract>
  </meta>
  ```
*/
module.exports = {

  type: 'article-meta',
  tagName: 'meta',

  import: function(el, node, converter) {
    node.id = 'article-meta';

    // Extract title
    var titleEl = el.find('title');
    if (titleEl) {
      node.title = converter.annotatedText(titleEl, [node.id, 'title']);
    } else {
      console.warn('ArticleMeta: no title found.');
      node.title = '';
    }

    var abstractEl = el.find('abstract');
    // Extract abstract
    if (abstractEl) {
      node.abstract = converter.annotatedText(abstractEl, [node.id, 'abstract']);
    } else {
      console.warn('ArticleMeta: no abstract found.');
      node.abstract = '';
    }

    // Extract authors
    node.authors = [];

  },

  export: function(node, el, converter) {
    // id does not need to be exported
    el.setId(null);
    var $$ = converter.$$;
    return el.append(
      $$('title').append(
        converter.annotatedText([node.id, 'title'])
      )).append(
      $$('abstract').append(
        converter.annotatedText([node.id, 'abstract'])
      )
    );
  }

};
