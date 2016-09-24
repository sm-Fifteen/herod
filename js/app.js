var app = angular.module('herod', ['ui.bootstrap']);

app.directive("ecuViewport", ["$timeout", function($timeout) {
    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element) {
            function generatePartitionLayout(champ, shape) {
                var layoutShapes = [];

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
                    var pivot = shape.bounds.getCenter();
                    var edgeRadius = 100; // TODO
                    var edgeVector = new scope.paper.Point({
                        length: edgeRadius,
                        angle: -90, // Aligned with Y+ instead of X+
                    });

                    for(var idx=0; idx<champ.layout.count; idx++) {
                        var part = champ.children[idx];

                        var origin = pivot.add(edgeVector);
                        console.log(origin);
                        edgeVector.angle += angle/2;
                        var midpoint = pivot.add(edgeVector);
                        edgeVector.angle += angle/2;
                        var endpoint = pivot.add(edgeVector);

                        var partShape = new scope.paper.Path.Arc(origin, midpoint, endpoint);
                        partShape.add(pivot);
                        partShape.closePath();
                        partShape.fillColor = part.couleur;
                        part.shape = partShape;
                        layoutShapes.push(partShape);
                    }
                }

                return layoutShapes;
            }

            function drawEcuOn(passedElement){
                if(!scope.paper) {
                    scope.paper = new paper.PaperScope();
                    scope.paper.setup(passedElement);
                }

                if(scope.ecu) {
                    var shape = scope.paper.PathItem.create(scope.ecu.forme);
                    shape.fitBounds(scope.paper.view.bounds);
                    ecu.layoutShapes = generatePartitionLayout(scope.ecu.champ, shape);

                    console.log(ecu.layoutShapes);

                    // The first shape in the group acts as the mask.
                    ecu.layoutShapes.unshift(shape);
                    var group = new scope.paper.Group(ecu.layoutShapes);
                    if (ecu.layoutShapes[0] === shape) group.clipped = true;
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
