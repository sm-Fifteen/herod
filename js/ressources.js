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

}

var extrapolateLine = function(paper, paperShape, origin, lineEnd){
    var lineStart = lineEnd.clone().rotate(180, origin);
    var line = new paper.Path.Line(lineEnd, lineStart);

    if(line.bounds.width >= 1) {
      var hScale = (paperShape.bounds.width + Math.abs(paperShape.bounds.center.x - origin.x)*2)/line.bounds.width;
    } else {
      var hScale = 0;
    }

    if(line.bounds.height >= 1) {
      var vScale = (paperShape.bounds.height + Math.abs(paperShape.bounds.center.y - origin.y)*2)/line.bounds.height;
    } else {
      var vScale = 0;
    }

    var scaleFactor = Math.max(hScale, vScale);
    return line.scale(scaleFactor, origin);
}

var edgeScan = function(paper, paperShape, origin, lineEnd){
    var line = extrapolateLine(paper, paperShape, origin, lineEnd);

    // Return in order of the line's direction
    return _.map(paperShape.getIntersections(line), "point").sort(function(point1, point2){
        return lineEnd.getDistance(point2) - lineEnd.getDistance(point1);
    });
}
