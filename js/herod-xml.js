// If you are wondering why anyone would use XML, turns out it's restrictive in
// all the right ways to make for a cohesively structured blazon data model.

// There can be a lot of complexity to some meubles.
// It might be good to have the parser lookup what the app knows how to draw instead,
// or outright delegate what's valid and what's not to the data model.


var parser = new DOMParser();
var testXmlDocument = parser.parseFromString("<blazon my-attr='foo'></blazon>", "application/xml");

var readHerodXml = function(xmlDocument) {
	var rootNode;

	if(xmlDocument.childElementCount === 1){
		rootNode = xmlDocument.firstElementChild;
	}

	if (!rootNode || rootNode.tagName !== "blazon") return;

	var herodData = Blazon.generateFromDOM(rootNode);
	return herodData;
}

readHerodXml(testXmlDocument);
