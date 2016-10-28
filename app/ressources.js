let R = {
	formes: {
		ecuFrancais: "M0,0 L0,50 Q0,80 50,110 Q100,80 100,50 L100,0 z",
	},

	couleurs: {
		azur: "#2b5df2",
		sable: "#000000",
		sinople: "#5ab532",
		pourpre: "#d576ad",
		or: "#fcef3c",
		argent: "#ffffff",
	},

	divisionModel: {
		axisAligned: "stripes",
		aroundCenter: "slices",
	},

	// divisionModel + nbDivisions + rotation
	// partGroup = new Partition.Tierce.Pal()

	partitions: {
		parti: {
			cuts: [
				["pointChef", "pointPointe"],
			],
			nameFr: ["Parti"],
		},
		coupe: {
			cuts: [
				["flancDextre", "flancSenestre"],
			],
			nameFr: ["Coupé"],
		},
		tranche: {
			cuts: [
				["chefDextre", "pointeSenestre"],
			],
			nameFr: ["Tranché"],
		},
		taille: {
			cuts: [
				["chefSenestre", "pointeDextre"],
			],
			nameFr: ["Taillé"],
		},
		ecartele: {
			cuts: [
				["flancDextre", "abyme", "pointChef"],
				["pointChef", "abyme", "flancSenestre"],
				["flancDextre", "abyme", "pointPointe"],
			],
		},
		ecarteleSautoir: {
			cuts: [
				["chefDextre", "abyme", "chefSenestre"],
				["chefDextre", "abyme", "pointeDextre"],
				["chefSenestre", "abyme", "pointeSenestre"],
			],
		},
		tiercePairle: {
			cuts: [
				["chefDextre", "abyme", "chefSenestre"],
				["chefDextre", "abyme", "pointPointe"],
				["chefSenestre", "abyme", "pointPointe"],
			],
		},
		tiercePairleInv: {
			cuts: [
				["pointeDextre", "abyme", "pointChef"],
				["pointeSenestre", "abyme", "pointChef"],
				["pointeDextre", "abyme", "pointeSenestre"],
			],
		},
	},
};

export default R;
