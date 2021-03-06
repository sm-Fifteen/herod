function extrapolateLine(paper, paperShape, origin, lineEnd) {
	var lineStart = lineEnd.clone().rotate(180, origin);
	var line = new paper.Path.Line(lineEnd, lineStart);

	var hScale = 0;
	if (line.bounds.width >= 1) {
		hScale = (paperShape.bounds.width + Math.abs(paperShape.bounds.center.x - origin.x)*2)/line.bounds.width;
	}

	var vScale = 0;
	if (line.bounds.height >= 1) {
		vScale = (paperShape.bounds.height + Math.abs(paperShape.bounds.center.y - origin.y)*2)/line.bounds.height;
	}

	var scaleFactor = Math.max(hScale, vScale);
	return line.scale(scaleFactor, origin);
}

function edgeScan(paper, paperShape, origin, lineEnd) {
	var line = extrapolateLine(paper, paperShape, origin, lineEnd);

	// Return in order of the line's direction
	return _.map(paperShape.getIntersections(line), "point").sort(function(point1, point2){
		return lineEnd.getDistance(point2) - lineEnd.getDistance(point1);
	});
}

function divideSurface2D(paper, paperShape, divisionsPerAxis){
	// TODO: StopFinder is wrong, and doesn't actually create 9 equal shapes like we need.

	var stopsX = divideSurface(paper, paperShape, divisionsPerAxis);
	// Flip the shape to get the Y axis
	var viewOrigin = paper.view.bounds.topLeft;
	paperShape.scale(1, -1, viewOrigin).rotate(90, viewOrigin);

	var stopsY = divideSurface(paper, paperShape, divisionsPerAxis);
	paperShape.scale(1, -1, viewOrigin).rotate(90, viewOrigin);

	return {
		x: stopsX,
		y: stopsY,
	}
}

function divideSurface(paper, paperShape, divisionsNeeded) {
	var stopsNeeded = divisionsNeeded-1;
	var targetArea = Math.abs(paperShape.area/divisionsNeeded); // Area may be negative (??)
	var tolerence = targetArea/200;
	var stops = [];

	stops[0] = paperShape.bounds.left;

	for(var stop = 1; stop <= stopsNeeded; stop++) {
		var regionStart = stops[stop-1];
		// We divide in 3, find the first stop, then the rest in half and find the second stop.
		var estimateSize = paperShape.bounds.width/(divisionsNeeded-stop+1);
		var maskSize = new paper.Size(estimateSize, paperShape.bounds.height);

		var i = 0;
		while (true) {
			var divisionMask = new paper.Path.Rectangle(new paper.Point(regionStart, paperShape.bounds.y), maskSize);
			var estimateArea = (new paper.Path(divisionMask.intersect(paperShape).pathData)).area;
			var estimateError = targetArea - estimateArea;

			if(Math.abs(estimateError) < tolerence) {
				stops[stop] = divisionMask.bounds.right;
				break;
			}

			// Measure the cross-section width/height of our shape
			var intersections = paperShape.getIntersections(new paper.Path.Line({
				// We seek along the x axis, so the limit of our estimate is always on the right
				from : [divisionMask.bounds.right, paperShape.bounds.top],
				to : [divisionMask.bounds.right, paperShape.bounds.bottom],
			}));

			var normalWidth = intersections[0].point.getDistance(intersections.reverse()[0].point);
			maskSize.width += (estimateError/normalWidth)/2;
		}
		stops[stopsNeeded+1] = paperShape.bounds.right;
	}

	return stops;
}

function slice(paper, paperShape, cut, pointsRef) {
	var line = new paper.Path();

	cut.forEach(function(cutPoint) {
		line.add(pointsRef[cutPoint]);
	})

	var intersections = [
		paperShape.getNearestLocation(pointsRef[cut[0]]),
		paperShape.getNearestLocation(pointsRef[cut.reverse()[0]]),
	];

	var curve = intersections[1].curve;
	newPath = curve.splitAt(intersections[1]);

	// Path is open but hasn't been split in 2
	if(newPath === paperShape) {
		var curve = intersections[0].curve;
		newPath = curve.splitAt(intersections[0]);
	}

	// First is the leftover paperShape, second is the piece we wanted
	// The one that fills the inside of our intersections is our piece.
	// For simplicity's sake, we use path length to guess that.

	if (paperShape.length < newPath.length) {
		var returnList = [newPath, paperShape];
	} else {
		var returnList = [paperShape, newPath];
	}

	paperShape.join(line.clone(), 5);
	paperShape.closePath();
	newPath.join(line.clone(), 5);
	newPath.closePath();

	return returnList;
}
