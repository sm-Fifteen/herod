function Blazon() {

}

Blazon.validChildren = [];
Blazon.validAttributes = [];

Blazon.generateFromDOM = function(domNode) {
	//domNode.attributes.getNamedItem("foo");
	//domNode.attributes.removeNamedItem("foo");

	if(domNode.attributes.length > 0) {
		console.warn("Blazon element with " + domNode.attributes.length + " unknown attributes.");
	}
}
