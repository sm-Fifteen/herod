var app = angular.module('herod', ['ui.bootstrap']);

app.directive("ecuViewport", ["$timeout", function($timeout) {
    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element) {
            function generatePartitionLayout(champ, shape) {
                var layoutShapes = [];
                shape.rotate(-champ.layout.rotation, champ.layout.pivot);

                if(champ.layout.model === DivisionModel.AxisAligned) {
                    var height =  shape.bounds.height;
                    var width = shape.bounds.width / champ.layout.count;

                    for(var idx=0; idx<champ.layout.count; idx++) {
                        var part = champ.children[idx];
                        var posX = shape.bounds.x + width * idx;
                        var posY = shape.bounds.y;

                        var dims = new scope.paper.Rectangle(posX, posY, width, height);

                        var partShape = new scope.paper.Shape.Rectangle(dims);
                        partShape.fillColor = part.couleur;
                        part.shape = partShape;
                        layoutShapes.push(partShape);
                    }
                } else if (champ.layout.model === DivisionModel.AroundCenter) {
                    var angle = 360/champ.layout.count;

                    var edgeRadius = Math.max(
                        champ.layout.pivot.getDistance(shape.bounds.topLeft),
                        champ.layout.pivot.getDistance(shape.bounds.topRight),
                        champ.layout.pivot.getDistance(shape.bounds.bottomLeft),
                        champ.layout.pivot.getDistance(shape.bounds.bottomRight)
                    )

                    var edgeVector = new scope.paper.Point({
                        length: edgeRadius,
                        angle: -90, // Aligned with Y+ instead of X+
                    });

                    for(var idx=0; idx<champ.layout.count; idx++) {
                        var part = champ.children[idx];

                        var origin = champ.layout.pivot.add(edgeVector);
                        console.log(origin);
                        edgeVector.angle += angle/2;
                        var midpoint = champ.layout.pivot.add(edgeVector);
                        edgeVector.angle += angle/2;
                        var endpoint = champ.layout.pivot.add(edgeVector);

                        var partShape = new scope.paper.Path.Arc(origin, midpoint, endpoint);
                        partShape.add(champ.layout.pivot);
                        partShape.closePath();
                        partShape.fillColor = part.couleur;
                        part.shape = partShape;
                        layoutShapes.push(partShape);
                    }
                }

                return layoutShapes;
            }

            function debugTableAttente(paperShape) {
                var divisionsPerAxis = 3;
                var stops = TableAttente.stopFinder2D(scope.paper, paperShape, divisionsPerAxis);
                var stopsX = stops.stopsX, stopsY = stops.stopsY;

                var regionMasks = [];
                for(var i = 0; i<divisionsPerAxis; i++) {
                    var y1 = stopsY[i], y2 = stopsY[i+1];

                    for(var j = 0; j<divisionsPerAxis; j++) {
                        var x1 = stopsX[j], x2 = stopsX[j+1];

                        regionMasks.push(new paper.Path.Rectangle({
                            from: [x1, y1],
                            to: [x2, y2],
                        }));
                    }
                }

                regionMasks.forEach(function(mask, idx){
                    mask.intersect(paperShape).fillColor = '#'+idx*11+''+idx*11+''+idx*11;
                });
            }

            function drawEcuOn(passedElement){
                if(!scope.paper) {
                    scope.paper = new paper.PaperScope();
                    scope.paper.setup(passedElement);
                }

                if(scope.ecu) {
                    var shape = scope.paper.PathItem.create(scope.ecu.forme);
                    shape.fitBounds(scope.paper.view.bounds);

                    scope.ecu.champ.layout.pivot = shape.bounds.getCenter();
                    ecu.layoutShapes = generatePartitionLayout(scope.ecu.champ, shape);

                    console.log(ecu.layoutShapes);

                    // The first shape in the group acts as the mask.
                    ecu.layoutShapes.unshift(shape);
                    var group = new scope.paper.Group(ecu.layoutShapes);
                    group.rotate(scope.ecu.champ.layout.rotation, scope.ecu.champ.layout.pivot);
                    if (ecu.layoutShapes[0] === shape) group.clipped = true;

                    //debugTableAttente(shape);
                }

                paper = scope.paper;
                paper.view.draw();
            }

            // Timeout with 0 delay, to wait for the DOM to render.
            $timeout(drawEcuOn(element[0]), 0);

            paper.view.onMouseDown = function(event){
                var hitResult = paper.project.hitTest(event.point);

                if (hitResult) scope.$apply(function() {
                    scope.ecu.selectedShape = hitResult.item;
                });
            }
        }
    }
}]);

app.controller('EcuCtrl', function($scope) {
    $scope.Couleurs = Couleurs;
    $scope.Partitions = Partitions;

    $scope.ecu = new Ecu();

    $scope.$watch("ecu.selectedShape", function(newVal, oldVal){
        if (oldVal) oldVal.selected = false;
        if (newVal) newVal.selected = true; // Might be undefined when starting up

        $scope.ecu.selectedPart = _.find($scope.ecu.champ.children, function(elem){
            return elem.shape === newVal;
        });
    });

    $scope.$watch("ecu.selectedPart.couleur", function(newVal) {
        // If selecedPart is empty, an object is created by angular with no associated shape
        if (_.get($scope.ecu.selectedPart, "shape")) {
            $scope.ecu.selectedPart.shape.fillColor = newVal;
        }
    });
});
