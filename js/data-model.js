function HerodElement() {

}

HerodElement.prototype.nodeName = "";
HerodElement.validChildren = Object.create(null);
HerodElement.validAttributes = Object.create(null);

HerodElement.prototype.generateFromDOM = function(domNode) {
	for(var i = 0; i < domNode.attributes.length; i++) {
		var attr = domNode.attributes[i];

		if(attr.name in this.constructor.validAttributes) {
			this.constructor.validAttributes[attr.name].call(this, attr.value);
		} else {
			console.warn("'" + this.nodeName + "' element with unknown attribute '" + attr.name + "'.");
		}
	}

	for(var i = 0; i < domNode.children.length; i++) {
		var child = domNode.children[i];

		if(child.tagName in this.constructor.validChildren) {
			this.constructor.validChildren[child.tagName].call(this, child);
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

function dataModelBoilerplate(NewConstructor) {
	NewConstructor.validChildren = Object.create(NewConstructor.prototype.constructor.validChildren);
	NewConstructor.validAttributes = Object.create(NewConstructor.prototype.constructor.validAttributes);
	NewConstructor.prototype.constructor = NewConstructor;
	NewConstructor.generateFromDOM = HerodElement.generateFromDOM;
}

function Blazon() {
	this.ecu = undefined;
}

Blazon.prototype = new HerodElement();
Blazon.prototype.nodeName = "blazon";
dataModelBoilerplate(Blazon);


Blazon.validChildren['ecu'] = function(childNode) {
	this.ecu = Ecu.generateFromDOM(childNode);
}


function Ecu() {
	this.forme = undefined;
	this.champ = undefined;
}

Ecu.prototype = new HerodElement();
Ecu.prototype.nodeName = "ecu";
dataModelBoilerplate(Ecu);

Ecu.validChildren['champ'] = function(childNode) {
	this.champ = Champ.generateFromDOM(childNode);
}

Ecu.validAttributes['forme'] = function(value) {
	this.forme = value;
}


function Quartier() {
	this.couleur = undefined; // Components is always ignored if a color is set
	this.components = []; // Includes partitions but also ordinaries
}

Quartier.prototype = new HerodElement();
Quartier.prototype.nodeName = "quartier";
dataModelBoilerplate(Quartier);

Quartier.validChildren['partition'] = function(childNode) {
	this.components.push(Partition.generateFromDOM(childNode));
}

Quartier.validAttributes['couleur'] = function(value) {
	this.couleur = value;
}


function Champ() {
	// Just a special copy of quartier for now, no special children or attributes
}

Champ.prototype = new Quartier();
Champ.prototype.nodeName = "champ";
dataModelBoilerplate(Champ);


function Partition() {
	this.division = undefined;
	this.children = [];
}

Partition.prototype = new HerodElement();
Partition.prototype.nodeName = "partition";
dataModelBoilerplate(Partition);

Partition.validChildren['quartier'] = function(childNode) {
	this.children.push(Quartier.generateFromDOM(childNode));
}

Partition.validAttributes['division'] = function(value) {
	this.division = value;
}
