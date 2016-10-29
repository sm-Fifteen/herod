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

DivisionModel = {
	AxisAligned : "stripes",
	AroundCenter : "slices",
}

//divisionModel + nbDivisions + rotation
//partGroup = new Partition.Tierce.Pal()

Partitions = {
	parti: {
		cuts: [
			["pointChef", "pointPointe"]
		],
		nameFr: ["Parti"],
	},
	coupe: {
		cuts: [
			["flancDextre", "flancSenestre"]
		],
		nameFr: ["Coupé"],
	},
	tranche: {
		cuts: [
			["chefDextre", "pointeSenestre"]
		],
		nameFr: ["Tranché"],
	},
	taille: {
		cuts: [
			["chefSenestre", "pointeDextre"]
		],
		nameFr: ["Taillé"],
	},
	ecartele: {
		cuts: [
			["flancDextre", "abyme", "pointChef"],
			["pointChef", "abyme", "flancSenestre"],
			["flancDextre", "abyme", "pointPointe"],
		]
	},
	ecarteleSautoir: {
		cuts: [
			["chefDextre", "abyme", "chefSenestre"],
			["chefDextre", "abyme", "pointeDextre"],
			["chefSenestre", "abyme", "pointeSenestre"],
		]
	},
	tiercePairle: {
		cuts: [
			["chefDextre", "abyme", "chefSenestre"],
			["chefDextre", "abyme", "pointPointe"],
			["chefSenestre", "abyme", "pointPointe"],
		]
	},
	tiercePairleInv: {
		cuts: [
			["pointeDextre", "abyme", "pointChef"],
			["pointeSenestre", "abyme", "pointChef"],
			["pointeDextre", "abyme", "pointeSenestre"],
		]
	},
}
