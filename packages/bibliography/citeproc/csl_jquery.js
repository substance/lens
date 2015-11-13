/* global $, CSL */
var inBrowser = (typeof window !== 'undefined');

/**
 * This is an XML adapter for CSL which uses jquery which is
 * provided by cheerio when used as a nodejs server module.
 */
var CSL_JQUERY = function () {
  // Copied from CSL_CHROME:
  // This seems horribly tormented, but there might be a reason for it.
  // Perhaps this was the only way I found to get namespacing to work ... ?
  this.institutionStr = '<institution institution-parts=\"long\" delimiter=\", \" substitute-use-first=\"1\" use-last=\"1\"><institution-part name=\"long\"/></institution>';
  this.ns = "http://purl.org/net/xbiblio/csl";
};

CSL_JQUERY.prototype._parseDoc = function(xml) {
  if (inBrowser) {
    var parser = new window.DOMParser();
    return parser.parseFromString(xml, "text/xml");
  } else {
    return $(xml);
  }
};

CSL_JQUERY.prototype.importNode = function(doc, srcElement) {
  if (inBrowser) {
    return doc.importNode(srcElement, true);
  } else {
    srcElement._root = doc._root;
    return srcElement;
  }
};

CSL_JQUERY.prototype._hasAttributes = function (node) {
  return (node.attributes && node.attributes.length > 0);
};


CSL_JQUERY.prototype._isElementNode = function(el) {
  if (inBrowser) {
    return (el.nodeType === window.Node.ELEMENT_NODE);
  } else {
    return el.type === "tag";
  }
};

CSL_JQUERY.prototype._getTagName = function(el) {
  if (!el.tagName) {
    return "";
  } else {
    return el.tagName.toLowerCase();
  }
};


/**
 * Copied from CSL_CHROME.prototype.clean.
 */
CSL_JQUERY.prototype.clean = function (xml) {
    xml = xml.replace(/<\?[^?]+\?>/g, "");
    xml = xml.replace(/<![^>]+>/g, "");
    xml = xml.replace(/^\s+/, "");
    xml = xml.replace(/\s+$/, "");
    xml = xml.replace(/^\n*/, "");
    return xml;
};

CSL_JQUERY.prototype.getStyleId = function (myxml, styleName) {
  var tagName = styleName ? "title" : "id";
  var node = $(myxml).find(tagName);
  if (node.length) {
    node = node[0];
  }
  return $(node).text();
};

CSL_JQUERY.prototype.children = function (myxml) {
  return $(myxml).children();
};

CSL_JQUERY.prototype.nodename = function (myxml) {
  return this._getTagName(myxml);
};

CSL_JQUERY.prototype.attributes = function (myxml) {
  var result = {};
  var attributes, attr;
  if (!myxml) {
  } else if (inBrowser) {
    if (this._hasAttributes(myxml)) {
      attributes = myxml.attributes;
      for (var pos = 0, len=attributes.length; pos < len; pos += 1) {
        attr = attributes[pos];
        result["@" + attr.name] = attr.value;
      }
    }
  } else {
    if (myxml.attribs) {
      attributes = myxml.attribs;
      for (var name in attributes) {
        if (attributes.hasOwnProperty(name)) {
          result["@" + name] = attributes[name];
        }
      }
    }
  }
  return result;
};

CSL_JQUERY.prototype.content = function (myxml) {
  return $(myxml).text();
};

CSL_JQUERY.prototype.namespace = {
  "xml":"http://www.w3.org/XML/1998/namespace"
};

CSL_JQUERY.prototype.numberofnodes = function (myxml) {
  if (myxml) {
    return myxml.length;
  } else {
    return 0;
  }
};

CSL_JQUERY.prototype.getAttributeName = function (attr) {
  // TODO: why should this be called with an attribute element?
  // as we never return such
  return attr.name;
};

CSL_JQUERY.prototype.getAttributeValue = function (myxml,name,namespace) {
  if (namespace) {
    name = namespace+":"+name;
  }
  return $(myxml).attr(name);
};

CSL_JQUERY.prototype.getNodeValue = function (myxml,name) {
  if (name){
    var $el = $(myxml).find(name);
    if ($el.length) {
      return $el.text();
    }
  } else {
    return $(myxml).text();
  }
};

CSL_JQUERY.prototype.setAttributeOnNodeIdentifiedByNameAttribute = function (myxml,nodename,partname,attrname,val) {
  if (attrname.slice(0,1) === '@'){
    attrname = attrname.slice(1);
  }
  $(myxml).find(nodename).each(function() {
    var $node = $(this);
    if ($node.attr("name") === partname) {
      $node.attr(attrname, val);
    }
  });
};

CSL_JQUERY.prototype.deleteNodeByNameAttribute = function (myxml,val) {
  $(myxml).find('*[name='+val+']').remove();
};

CSL_JQUERY.prototype.deleteAttribute = function (myxml,attr) {
  $(myxml).removeAttr(attr);
};

CSL_JQUERY.prototype.setAttribute = function (myxml,attr,val) {
  $(myxml).attr(attr,val);
  // CSL_CHROME does return 'false'
  return false;
};

CSL_JQUERY.prototype.nodeCopy = function (myxml) {
  return $(myxml).clone();
};

CSL_JQUERY.prototype.getNodesByName = function (myxml,name,nameattrval) {
  return $(myxml).find(name+'[name='+nameattrval+']');
};

CSL_JQUERY.prototype.nodeNameIs = function (myxml,name) {
  return (this._getTagName(myxml) === name);
};

CSL_JQUERY.prototype.makeXml = function (myxml) {
  if (!myxml) {
    myxml = "<docco><bogus/></docco>";
  }
  myxml = myxml.replace(/\s*<\?[^>]*\?>\s*\n*/g, "");
  var doc = this._parseDoc(myxml);
  var root;
  if (inBrowser) {
    root = doc.firstChild;
  } else {
    root = doc._root;
  }
  return root;
};

CSL_JQUERY.prototype.insertChildNodeAfter = function (parent,node,pos,datexml) {
  var myxml = this.importNode(node.ownerDocument, datexml);
  $(myxml).insertAfter(node);
  return parent;
};

/**
 * Copied from CSL_CHROME and adapted.
 * TODO: this could get some explanation
 */
CSL_JQUERY.prototype.insertPublisherAndPlace = function(myxml) {
  var group = $(myxml).find("group");
  for (var i = 0, ilen = group.length; i < ilen; i += 1) {
    var $group = $(group[i]);
    var $publisher = $group.find('[variable=publisher]');
    var $publisherPlace = $group.find('[variable=publisher-place]');
    if ($publisher.length && $publisherPlace.length) {
      $group.attr('has-publisher-and-publisher-place', true);
    }
  }
};

// add a name element <names> if it does not contain any name
// is not child of substitute
CSL_JQUERY.prototype.addMissingNameNodes = function(myxml) {
  $(myxml).find("names").each(function() {
    var $namesEl = $(this);
    var $nameEls = $namesEl.find('name');
    if ($nameEls.length === 0 && !$namesEl.parent('substitute')) {
      $namesEl.append($('<name>'));
    }
  });
};

// add <institution> to <names> with <name> when missing
CSL_JQUERY.prototype.addInstitutionNodes = function(myxml) {

  function _addInstitutionPartAttributes($institutionPart, $nameEl) {
    for (var j = 0, jlen = CSL.INSTITUTION_KEYS.length; j < jlen; j += 1) {
      var attrname = CSL.INSTITUTION_KEYS[j];
      var attrval = $nameEl.attr(attrname);
      if (attrval) {
        $institutionPart.attr(attrname, attrval);
      }
    }
  }

  $(myxml).find('names').each(function() {
    var $nameEl = $(this).find('name');
    var $institution = $(this).find('institution');
    if ($nameEl.length && !$institution.length) {
      $institution = $(this.institutionStr);
      var $institutionPart = $institution.find("institution-part");
      _addInstitutionPartAttributes($institutionPart, $nameEl);
      $nameEl.find("name-part[name=family]").each(function() {
        _addInstitutionPartAttributes($institutionPart, $(this));
      });
      $institution.insertBefore($nameEl);
    }
  });
};

CSL_JQUERY.prototype.flagDateMacros = function(myxml) {
  $(myxml).find('macro').each(function() {
    var $macro = $(this);
    var $date = $macro.find('data');
    if ($date.length) {
      $macro.attr('macro-has-date', 'true');
    }
  });
};

module.exports = CSL_JQUERY;
