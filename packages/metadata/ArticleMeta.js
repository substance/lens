var $ = require('substance/util/jquery');
var DocumentNode = require('substance/model/DocumentNode');

var ArticleMeta = DocumentNode.extend({
  name: "article-meta",
  properties: {
    "title": "string",
    "authors": ["array", "string"],
    "abstract": "string"
  }
});

/*
<meta>
  <title>The <em>Substance</em> Article Format</title>
  <abstract>Article abstract with <strong>annotations</strong></abstract>
</meta>
*/

ArticleMeta.static.matchElement = function($el) {
  return $el.is('meta');
};

ArticleMeta.static.fromHtml = function($el, converter) {
  var id = 'article-meta';
  var meta = {
    id: id,
    title: "",
    authors: [],
    abstract: "",
  };
  var $title = $el.find('title');
  if ($title.length) {
    meta.title = converter.annotatedText($title, [id, 'title']);
  } else {
    converter.warning('ArticleMeta: no title found.');
  }

  // Extract authors
  var $authors = $el.find('authors author');

  $authors.each(function() {
    var author = converter.convertElement($(this));
    meta.authors.push(author.id);
  });

  var $abstract = $el.find('abstract');
  if ($abstract.length) {
    meta.abstract = converter.annotatedText($abstract, [id, 'abstract']);
  } else {
    converter.warning('ArticleMeta: no abstract found.');
  }

  return meta;
};

ArticleMeta.static.toHtml = function(articleMeta, converter) {
  var id = articleMeta.id;
  var $el = $('<meta>');
  var doc = converter.getDocument();

  var $title = $('<title>')
    .append(converter.annotatedText([id, 'title']));

  var $abstract = $('<abstract>')
    .append(converter.annotatedText([id, 'abstract']));

  // Authors
  var $authors = $('<authors>');
  articleMeta.authors.forEach(function(authorId) {
    var author = doc.get(authorId);
    $authors.append(converter.convertNode(author));
  });

  return $el.append($title, $authors, $abstract);
};

module.exports = ArticleMeta;
