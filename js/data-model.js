function Blazon() {

}

Blazon.validChildren = {
	'foo': function(childNode) {

	}
};

Blazon.validAttributes = {
	'my-attr': function(value) {

	}
};

Blazon.generateFromDOM = function(domNode) {
	for(var i = 0; i < domNode.attributes.length; i++) {
		var attr = domNode.attributes[i];

		if(Blazon.validAttributes.hasOwnProperty(attr.name)) {
			Blazon.validAttributes[attr.name](attr.value);
		} else {
			console.warn("Blazon element with unknown attribute '" + attr.name + "'.");
		}
	}

	for(var i = 0; i < domNode.children.length; i++) {
		var child = domNode.children[i];

		if(Blazon.validChildren.hasOwnProperty(child.tagName)) {
			Blazon.validChildren[child.tagName](child);
		} else {
			console.warn("Blazon element with unknown child '" + child.tagName + "'.");
		}
	}
}
