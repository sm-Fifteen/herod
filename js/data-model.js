function HerodElement() {

}

HerodElement.prototype.nodeName = "";
HerodElement.validChildren = Object.create(null);
HerodElement.validAttributes = Object.create(null);

HerodElement.prototype.generateFromDOM = function(domNode) {
	for(var i = 0; i < domNode.attributes.length; i++) {
		var attr = domNode.attributes[i];

		if(attr.name in this.constructor.validAttributes) {
			this.constructor.validAttributes[attr.name](attr.value);
		} else {
			console.warn("'" + this.nodeName + "' element with unknown attribute '" + attr.name + "'.");
		}
	}

	for(var i = 0; i < domNode.children.length; i++) {
		var child = domNode.children[i];

		if(child.tagName in this.constructor.validChildren) {
			this.constructor.validChildren[child.tagName](child);
		} else {
			console.warn("'" + this.nodeName + "' element with unknown child '" + child.tagName + "'.");
		}
	}
}

HerodElement.generateFromDOM = function(domNode) {
	var newNode = new this();
	newNode.generateFromDOM(domNode);
	return newNode;
}

function Blazon() {

}

Blazon.prototype = new HerodElement();
Blazon.validChildren = Object.create(Blazon.prototype.constructor.validChildren);
Blazon.validAttributes = Object.create(Blazon.prototype.constructor.validAttributes);
Blazon.prototype.constructor = Blazon;
Blazon.prototype.nodeName = "blazon";
Blazon.generateFromDOM = HerodElement.generateFromDOM;


Blazon.validChildren['foo'] = function(childNode) {
	// this.children.push(new Foo(childNode));
}

Blazon.validAttributes['my-attr'] = function(value) {
	// this.attr = value;
}
