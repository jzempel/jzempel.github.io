function getUrl(path)
{
  var index = location.href.lastIndexOf('/');
  var url = location.href.substring(0, index);

  return url + '/' + path;
}

function getXmlDocument(url)
{
  var retVal = null;

  if (window.ActiveXObject)
  {
    retVal = new ActiveXObject('Msxml2.FreeThreadedDOMDocument');
    retVal.preserveWhiteSpace = true;
    retVal.async = false;
    retVal.load(url);
  }
  else
  {
    var xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.open('get', url, false /*asynchronous*/);
    xmlHttpRequest.overrideMimeType('text/xml');
    xmlHttpRequest.send(null);

    if (xmlHttpRequest.status == 200)
    {
      retVal = xmlHttpRequest.responseXML;
    }
  }

  return retVal;
}

function transform(xmlUrl, xslUrl, links)
{
  var retVal = null;
  var xmlDocument = getXmlDocument(xmlUrl);
  var xslDocument = getXmlDocument(xslUrl);

  if (xmlDocument != null && xslDocument != null)
  {
    var myLinks = '';

    if (links != null)
    {
      for (var link in links)
      {
        myLinks += links[link] + ',' + link + ';';
      }
    }

    if (window.ActiveXObject)
    {
      var xslTemplate = new ActiveXObject('MSXML2.XSLTemplate');

      xslTemplate.stylesheet = xslDocument;

      var xsltProcessor = xslTemplate.createProcessor();

      xsltProcessor.addParameter('myLinks', myLinks);
      xsltProcessor.input = xmlDocument;
      xsltProcessor.transform();
      retVal = xsltProcessor.output;
    }
    else if (typeof XSLTProcessor != 'undefined')
    {
      var xsltProcessor = new XSLTProcessor();

      xsltProcessor.setParameter(null /*namespace*/, 'myLinks', myLinks);
      xsltProcessor.importStylesheet(xslDocument);

      var transformXml = xsltProcessor.transformToDocument(xmlDocument);
      var xmlSerializer = new XMLSerializer();

      retVal = xmlSerializer.serializeToString(transformXml);
    }
  }

  return retVal;
}
