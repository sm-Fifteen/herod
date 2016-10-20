function Ecu() {
  this.forme = Formes.EcuFrancais;
  this.champ = testPartitionGroup;

  this.selectedShape = undefined; // A paper shape, added by the directive
  this.selectedPart = undefined; // The partition represented by that shape, added by the controler
}

// AKA Logical partition
var testPartitionGroup = {
    partition: Partitions.parti,
    children: [{
        couleur: Couleurs.Azur,
        },{
        couleur: Couleurs.Sable,
        },{
        couleur: Couleurs.Azur,
        },{
        couleur: Couleurs.Sable,
    },]
}
