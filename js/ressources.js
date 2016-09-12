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
