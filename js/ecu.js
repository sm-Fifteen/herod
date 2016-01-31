Formes = {
  EcuFrancais: 'M0,0 L0,5 Q0,8 5,11 Q10,8 10,5 L10,0 z'
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
  $('#ecu').width(100).height(110);

  this.svg.bg = this.svg.rect(100, 110).fill(this.couleur);
  this.svg.ecu = this.svg.path(this.forme).size(100);
  this.svg.bg.clipWith(this.svg.ecu);
};

Ecu.prototype.updateCouleur = function() {
  if (this.svg) {
    this.svg.bg.fill(Couleurs[this.couleur]);
  }
};

ecu = new Ecu();
$(document).ready(ecu.init);
