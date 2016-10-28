import _ from "lodash";

class Geometry {
 	static extrapolateLine(paper, paperShape, origin, lineEnd) {
		let lineStart = lineEnd.clone().rotate(180, origin);
		let line = new paper.Path.Line(lineEnd, lineStart);

		let hScale = 0, vScale = 0;

		if (line.bounds.width >= 1) {
			hScale = (paperShape.bounds.width + Math.abs(paperShape.bounds.center.x - origin.x) * 2) / line.bounds.width;
		}

		if (line.bounds.height >= 1) {
			vScale = (paperShape.bounds.height + Math.abs(paperShape.bounds.center.y - origin.y) * 2) / line.bounds.height;
		}

		let scaleFactor = Math.max(hScale, vScale);
		return line.scale(scaleFactor, origin);
	}

	static edgeScan(paper, paperShape, origin, lineEnd) {
		let line = this.extrapolateLine(paper, paperShape, origin, lineEnd);

		// Return in order of the line's direction
		return _.map(paperShape.getIntersections(line), "point").sort(function (point1, point2) {
			return lineEnd.getDistance(point2) - lineEnd.getDistance(point1);
		});
	}

	static divideSurface2D(paper, paperShape, divisionsPerAxis) {
		// TODO: StopFinder is wrong, and doesn't actually create 9 equal shapes like we need.

		let stopsX = this.divideSurface(paper, paperShape, divisionsPerAxis);
		// Flip the shape to get the Y axis
		let viewOrigin = paper.view.bounds.topLeft;
		paperShape.scale(1, -1, viewOrigin).rotate(90, viewOrigin);

		let stopsY = this.divideSurface(paper, paperShape, divisionsPerAxis);
		paperShape.scale(1, -1, viewOrigin).rotate(90, viewOrigin);

		return {x: stopsX, y: stopsY};
	}

	static divideSurface(paper, paperShape, divisionsNeeded) {
		let stopsNeeded = divisionsNeeded - 1;
		let targetArea = Math.abs(paperShape.area / divisionsNeeded); // Area may be negative (??)
		let tolerence = targetArea / 200;
		let stops = [paperShape.bounds.left];

		for (let stop = 1; stop <= stopsNeeded; stop++) {
			let regionStart = stops[stop - 1];
			// We divide in 3, find the first stop, then the rest in half and find the second stop.
			let estimateSize = paperShape.bounds.width / (divisionsNeeded - stop + 1);
			let maskSize = new paper.Size(estimateSize, paperShape.bounds.height);

			let i = 0;
			while (true) {
				let divisionMask = new paper.Path.Rectangle(new paper.Point(regionStart, paperShape.bounds.y), maskSize);
				let estimateArea = (new paper.Path(divisionMask.intersect(paperShape).pathData)).area;
				let estimateError = targetArea - estimateArea;

				if (Math.abs(estimateError) < tolerence) {
					stops[stop] = divisionMask.bounds.right;
					break;
				}

				// Measure the cross-section width/height of our shape
				let intersections = paperShape.getIntersections(new paper.Path.Line({
					// We seek along the x axis, so the limit of our estimate is always on the right
					from: [divisionMask.bounds.right, paperShape.bounds.top],
					to: [divisionMask.bounds.right, paperShape.bounds.bottom],
				}));

				let normalWidth = intersections[0].point.getDistance(intersections.reverse()[0].point);
				maskSize.width += (estimateError/normalWidth) / 2;
			}
			stops[stopsNeeded + 1] = paperShape.bounds.right;
		}

		return stops;
	}

	static slice(paper, paperShape, cut, pointsRef) {
		let line = new paper.Path();

		cut.forEach(cutPoint => line.add(pointsRef[cutPoint]));

		let intersections = [
			paperShape.getNearestLocation(pointsRef[cut[0]]),
			paperShape.getNearestLocation(pointsRef[cut.reverse()[0]]),
		];

		let curve = intersections[1].curve;
		let newPath = curve.splitAt(intersections[1]);

		// Path is open but hasn't been split in 2
		if (newPath === paperShape) {
			curve = intersections[0].curve;
			newPath = curve.splitAt(intersections[0]);
		}

		// First is the leftover paperShape, second is the piece we wanted
		// The one that fills the inside of our intersections is our piece.
		// For simplicity's sake, we use path length to guess that.

		let returnList = [paperShape, newPath];
		if (paperShape.length < newPath.length) {
			returnList = [newPath, paperShape];
		}

		paperShape.join(line.clone(), 5);
		paperShape.closePath();
		newPath.join(line.clone(), 5);
		newPath.closePath();

		return returnList;
	}
}

export default Geometry;
