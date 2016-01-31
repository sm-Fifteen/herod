Formes = {
  EcuFrancais: 'M0,0 L0,50 Q0,80 50,110 Q100,80 100,50 L100,0 z'
}

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

  this.svg.bg = this.svg.rect(100, 110).fill(this.couleur);
  this.svg.ecu = this.svg.path(this.forme).size(100);
  this.svg.bg.clipWith(this.svg.ecu);
};

Ecu.prototype.updateCouleur = function() {
  if (this.svg) {
    this.svg.bg.fill(this.couleur);
  }
};

ecu = new Ecu();
$(document).ready(ecu.init);
