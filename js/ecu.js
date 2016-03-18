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

function Ecu() {
  this.forme = Formes.EcuFrancais;
  this.couleur = Couleurs.Azur;

  _.bindAll(this, 'init', 'updateCouleur');
}

Ecu.prototype.init = function() {
  this.svg = SVG('ecu');
  this.svg.viewbox(0, 0, 100, 110);

  this.svg.parts = [];  
  this.svg.ecu = this.svg.path(this.forme).size(100);
  
  var width=this.svg.ecu.width();
  var height=this.svg.ecu.height();
  
  this.svg.parts.push(this.svg.rect(width/2, height).fill(this.couleur));
  this.svg.parts.push(this.svg.rect(width/2, height).x(width/2).fill(Couleurs.Gueules));
  
  var clip = this.svg.clip().add(this.svg.ecu);
  
  this.svg.parts.forEach(function(part, idx, array) {
    array[idx] = part.clipWith(clip);
  }, this);
};

Ecu.prototype.updateCouleur = function() {
  if (this.svg) {
    this.svg.parts[0].fill(this.couleur);
  }
};

ecu = new Ecu();
$(document).ready(ecu.init);
