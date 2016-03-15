# Lens (editable edition)

This is an evolution of [eLife Lens](http://github.com/elifesciences/lens), developed by [Substance](http://substance.io). It comes with a Writer component for web-based authoring and a new Reader component for displaying of scientific content. 

Read about the backgrounds of this project:

- https://medium.com/@_mql/self-host-a-scientific-journal-with-elife-lens-f420afb678aa
- https://medium.com/@_mql/produce-a-scientific-paper-with-lens-writer-d0fc75d11919

*Important note: This project is at an experimental state. It is also not compatible with JATS/NLM at this stage, as it reads a simplified custom XML format. We will add support for JATS import + export at a later time.*

## Install dev version

Clone the repository.

```bash
$ git clone https://github.com/substance/lens.git
```

Navigate to the source directory.

```bash
$ cd lens
```

Install dependencies via npm

```bash
$ npm install
```

Start the dev server

```bash
$ npm run start
```

And navigate to [http://localhost:5000](http://localhost:5000)

To create a new demo bundle do this:

```bash
$ npm run bundle
```

## Usage

To embed Lens Reader:

```js
var LensReader = require('lens/LensReader');
var LensArticle = require('lens/model/LensArticle');
var Component = require('substance/ui/component');
var $$ = Component.$$;

var doc = LensArticle.fromXml(LENS_XML);

Component.mount($$(LensReader, {
  doc: doc
}), document.body);
```

To embed Lens Writer:

```js
var LensWriter = require('lens/LensWriter');
var LensArticle = require('lens/model/LensArticle');
var Component = require('substance/ui/component');
var $$ = Component.$$;

var doc = LensArticle.fromXml(LENS_XML);

Component.mount($$(LensWriter, {
  doc: doc,
  onUploadFile: function(file, cb) {
    console.log('custom file upload handler in action...');
    var fileUrl = window.URL.createObjectURL(file);
    cb(null, fileUrl);  
  },
  onSave: function(doc, changes, cb) {
    console.log('custom save handler in action...', doc.toXml());
    cb(null);
  }
}), document.body);
```

Make sure to also include the stylesheets into your app. We provide entry points at `styles/lens-writer.sass` and `styles/lens-reader.sass`. Lens requires a module bundler, such as Browserify or Webpack.
