Formes = {
  EcuFrancais: 'M0,0 L0,50 Q0,80 50,110 Q100,80 100,50 L100,0 z'
};

Couleurs = {
  Gueules: '#e20909',
  Azur: '#2b5df2',
  Sable: '#000000',
  Sinople: '#5ab532',
  Pourpre: '#d576ad',
  Or: '#fcef3c',
  Argent: '#ffffff'
};

Partitions = {
	Plain: function(height, width) {
		this.svg.parts.push(this.svg.rect(width, height).fill(this.couleur));
	},
	Parti: function(height, width) {
		this.svg.parts.push(this.svg.rect(width/2, height).fill(this.couleur));
		this.svg.parts.push(this.svg.rect(width/2, height).x(width/2).fill(this.couleurAlt));
	},
}

function Ecu() {
  this.forme = Formes.EcuFrancais;
  this.partition = Partitions.Plain;
  this.couleur = Couleurs.Azur;
  this.couleurAlt = Couleurs.Gueules;

  _.bindAll(this, 'init', 'updatePartition', 'updateCouleur');
}

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

ecu = new Ecu();
$(document).ready(ecu.init);
