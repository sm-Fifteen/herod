import Geometry from "geometry"

class TableAttente {
	constructor(points, regions) {
		this.points = points;
		this.regions = regions;
		// this.directions = {};
	}

	static generateTable(paper, paperShape) {
		return new TableAttente(
			TableAttente.generatePoints(paper, paperShape),
			TableAttente.generateRegions(paper, paperShape)
		);
	}

	static generatePoints(paper, paperShape) {
		let stops = Geometry.divideSurface2D(paper, paperShape, 2);

		let center = new paper.Point(stops.x[1], stops.y[1]);

		let parti = Geometry.edgeScan(paper, paperShape, center, new paper.Point(stops.x[1], stops.y[2]));
		let coupe = Geometry.edgeScan(paper, paperShape, center, new paper.Point(stops.x[2], stops.y[1]));
		let tranche = Geometry.edgeScan(paper, paperShape, new paper.Point(stops.x[0], stops.y[0]), center);
		let taille = Geometry.edgeScan(paper, paperShape, new paper.Point(stops.x[2], stops.y[0]), center);

		return {
			pointChef: parti[0],
			pointPointe: parti.reverse()[0],

			// Dexter and Sinister are the left and right of the bearer.
			// They are reversed here.
			flancDextre: coupe[0],
			flancSenestre: coupe.reverse()[0],
			chefDextre: tranche[0],
			pointeSenestre: tranche.reverse()[0],
			chefSenestre: taille[0],
			pointeDextre: taille.reverse()[0],

			abyme: center,
		};
	}

	static generateRegions(paper, paperShape) {
		let divisionsPerAxis = 3;
		let stops = Geometry.divideSurface2D(paper, paperShape, divisionsPerAxis);

		let regionMasks = [];
		for (let i = 0; i < divisionsPerAxis; i++) {
			let y1 = stops.y[i], y2 = stops.y[i + 1];

			for (let j = 0; j < divisionsPerAxis; j++) {
				let x1 = stops.x[j], x2 = stops.x[j + 1];

				regionMasks.push(new paper.Path.Rectangle({
					from: [x1, y1],
					to: [x2, y2],
				}));
			}
		}

		return regionMasks;
	}
}

export default TableAttente;
