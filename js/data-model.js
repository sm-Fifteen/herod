function HerodElement() {

}

HerodElement.nodeName = "";
HerodElement.prototype.validChildren = Object.create(null);
HerodElement.prototype.validAttributes = Object.create(null);

HerodElement.prototype.generateFromDOM = function(domNode) {
	for(var i = 0; i < domNode.attributes.length; i++) {
		var attr = domNode.attributes[i];

		if(attr.name in this.validAttributes) {
			this.validAttributes[attr.name](attr.value);
		} else {
			console.warn("'" + this.nodeName + "' element with unknown attribute '" + attr.name + "'.");
		}
	}

	for(var i = 0; i < domNode.children.length; i++) {
		var child = domNode.children[i];

		if(child.tagName in this.validChildren) {
			this.validChildren[child.tagName](child);
		} else {
			console.warn("'" + this.nodeName + "' element with unknown child '" + child.tagName + "'.");
		}
	}
}

function Blazon() {

}

Blazon.prototype = new HerodElement();
Blazon.prototype.constructor = Blazon;
Blazon.prototype.nodeName = "blazon";

Blazon.prototype.validChildren['foo'] = function(childNode) {
	// this.children.push(new Foo(childNode));
}

Blazon.prototype.validAttributes['my-attr'] = function(value) {
	// this.attr = value;
}

Blazon.generateFromDOM = function(domNode) {
	var newNode = new Blazon();
	newNode.generateFromDOM(domNode);
	return newNode;
}
