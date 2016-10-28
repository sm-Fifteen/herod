import R from "ressources";

class Ecu {
	constructor() {
		this.forme = R.formes.ecuFrancais;
		this.champ = Ecu.testPartitionGroup;

		this.selectedShape = undefined; // A paper shape, added by the directive
		this.selectedPart = undefined; // The partition represented by that shape, added by the controller
	}
}

Ecu.testPartitionGroup = {
	partition: R.partitions.ecartele,
	// table: new TableAttente(),
	children: [
		{couleur: R.couleurs.azur},
		{couleur: R.couleurs.sable},
		{couleur: R.couleurs.sable},
		{couleur: R.couleurs.azur},
	],
};

export default Ecu;
