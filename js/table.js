function TableAttente(points, regions) {
	this.points = points;
	this.regions = regions;
	//this.directions = { }
}

TableAttente.generateTable = function(paper, paperShape){
	return new TableAttente(
		TableAttente.generatePoints(paper, paperShape),
		TableAttente.generateRegions(paper, paperShape)
	);
}

TableAttente.generatePoints = function(paper, paperShape) {
	var stops = divideSurface2D(paper, paperShape, 2);

	var center = new paper.Point(stops.x[1], stops.y[1]);

	var parti = edgeScan(paper, paperShape,
		center, new paper.Point(stops.x[1], stops.y[2]));
		var coupe = edgeScan(paper, paperShape,
			center, new paper.Point(stops.x[2], stops.y[1]));
			var tranche = edgeScan(paper, paperShape,
				new paper.Point(stops.x[0], stops.y[0]), center);
				var taille = edgeScan(paper, paperShape,
					new paper.Point(stops.x[2], stops.y[0]), center);

					return {
						pointChef: parti[0],
						pointPointe: parti.reverse()[0],

						// Dexter and Sinister are the left and right of the bearer
						// They are reversd here.
						flancDextre: coupe[0],
						flancSenestre: coupe.reverse()[0],
						chefDextre: tranche[0],
						pointeSenestre: tranche.reverse()[0],
						chefSenestre: taille[0],
						pointeDextre: taille.reverse()[0],

						abyme: center,
					}
				}

				TableAttente.generateRegions = function(paper, paperShape) {
					var divisionsPerAxis = 3;
					var stops = divideSurface2D(paper, paperShape, divisionsPerAxis);

					var regionMasks = [];
					for(var i = 0; i<divisionsPerAxis; i++) {
						var y1 = stops.y[i], y2 = stops.y[i+1];

						for(var j = 0; j<divisionsPerAxis; j++) {
							var x1 = stops.x[j], x2 = stops.x[j+1];

							regionMasks.push(new paper.Path.Rectangle({
								from: [x1, y1],
								to: [x2, y2],
							}));
						}
					}

					return regionMasks;
				}
