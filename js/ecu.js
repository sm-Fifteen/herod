function Ecu() {
  this.forme = Formes.EcuFrancais;
  this.partition = Partitions.Plain;
  this.parts = [];
  this.couleur = Couleurs.Azur;
  this.couleurAlt = Couleurs.Gueules;

  //this.selectedPart; //A paper shape, added by the directive
}

function PartitionGroup() {
    this.style = "Tiercé";
    this.axis = "Pal"
    this.partitions = {

    }
}

function Partition() {
    this.background;
}

/*
Ecu.prototype.init = function() {
  // Initiallize surface
  this.svg = SVG('ecu');
  this.svg.viewbox(0, 0, 100, 110);

  this.svg.parts = [];
  this.svg.ecu = this.svg.path(this.forme).size(100);

  this.svg.clippath = this.svg.clip().add(this.svg.ecu);

  // Define and clip partitions
  this.updatePartition();
};

Ecu.prototype.updateCouleur = function() {
  if (this.svg) {
    this.svg.parts[0].fill(this.couleur);
  }
};

Ecu.prototype.updatePartition = function() {
  console.log("Updated")
  if (this.svg) {
	this.svg.parts.forEach(function(part) {
		part.remove();
	})
	this.svg.parts.length = 0;
    this.partition.apply(this, [this.svg.ecu.height(), this.svg.ecu.width()]);

	this.reclip();
  }
}

Ecu.prototype.reclip = function() {
  this.svg.parts.forEach(function(part, idx, array) {
    array[idx] = part.clipWith(this.svg.clippath);
  }, this);
}
*/
