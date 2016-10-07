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

function TableAttente(paper, paperShape) {
    this.sommets = {

    }
    this.directions = {

    }
    this.regions = {

    }
}

TableAttente.generateTable = function(paper, paperShape){
    var stopsX = TableAttente.stopFinder(paper, paperShape);
    // Flip the shape to get the Y axis
    var viewOrigin = paper.view.bounds.topLeft;
    var stopsY = TableAttente.stopFinder(paper, paperShape.scale(1, -1, viewOrigin).rotate(90, viewOrigin));
    paperShape.scale(1, -1, viewOrigin).rotate(90, viewOrigin);
    return {
        x:stopsX,
        y:stopsY,
    }
}

TableAttente.stopFinder = function(paper, paperShape) {
    var divisionsNeeded = 3;
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
