function Ecu() {
  this.forme = Formes.EcuFrancais;
  this.champ = testPartitionGroup;

  this.selectedShape = undefined; // A paper shape, added by the directive
  this.selectedPart = undefined; // The partition represented by that shape, added by the controler
}


// AKA Logical partition
var testPartitionGroup = {
    layout: {
        "model" : DivisionModel.AroundCenter,
        "count" : 3,
        "rotation" : 60,
    },
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
    var stops = TableAttente.stopFinder2D(paper, paperShape, 2);

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
    }
}

TableAttente.generateRegions = function(paper, paperShape) {
    var divisionsPerAxis = 3;
    var stops = TableAttente.stopFinder2D(paper, paperShape, divisionsPerAxis);

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

TableAttente.stopFinder2D = function(paper, paperShape, divisionsPerAxis){
    // TODO: StopFinder is wrong, and doesn't actually create 9 equal shapes like we need.

    var stopsX = TableAttente.stopFinder(paper, paperShape, divisionsPerAxis);
    // Flip the shape to get the Y axis
    var viewOrigin = paper.view.bounds.topLeft;
    paperShape.scale(1, -1, viewOrigin).rotate(90, viewOrigin);

    var stopsY = TableAttente.stopFinder(paper, paperShape, divisionsPerAxis);
    paperShape.scale(1, -1, viewOrigin).rotate(90, viewOrigin);

    return {
        x: stopsX,
        y: stopsY,
    }
}

TableAttente.stopFinder = function(paper, paperShape, divisionsNeeded) {
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

/*
Ecu.prototype.init = function() {
  // Initiallize surface
  this.svg = SVG('ecu');
  this.svg.viewbox(0, 0, 100, 110);

  this.svg.parts = [];
  this.svg.ecu = this.svg.path(this.forme).size(100);

  this.svg.clippath = this.svg.clip().add(this.svg.ecu);

  // Define and clip partitions
  this.updatePartition();
};

Ecu.prototype.updateCouleur = function() {
  if (this.svg) {
    this.svg.parts[0].fill(this.couleur);
  }
};

Ecu.prototype.updatePartition = function() {
  console.log("Updated")
  if (this.svg) {
	this.svg.parts.forEach(function(part) {
		part.remove();
	})
	this.svg.parts.length = 0;
    this.partition.apply(this, [this.svg.ecu.height(), this.svg.ecu.width()]);

	this.reclip();
  }
}

Ecu.prototype.reclip = function() {
  this.svg.parts.forEach(function(part, idx, array) {
    array[idx] = part.clipWith(this.svg.clippath);
  }, this);
}
*/
