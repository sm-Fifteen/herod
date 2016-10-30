var test = require('tape');
var log = require('tap-browser-console-color');
log.patch();

paper.setup(document.getElementById("canvas"));
// test divideSurface2D

function generateRegions(paperShape) {
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

	var regions = regionMasks.map(function (mask) {
		return mask.intersect(paperShape);
	})

	return regions;
}

test('regions are of approximately equal surface', function (t) {
	var paperShape = new paper.Path('M0,0 L0,50 Q0,80 50,110 Q100,80 100,50 L100,0 z');
	var rectangle = new paper.Path.Rectangle(paperShape.bounds);

	var regions = generateRegions(paperShape);

	var firstArea = regions.pop().area;
	t.plan(regions.length);
	for (var i = 0; i < regions.length; i++) {
		var delta = Math.abs(firstArea - regions[i].area);
		t.comment(delta);
		t.ok(delta < 60);
	}
});
