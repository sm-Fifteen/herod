var app = angular.module('herod', ['ui.bootstrap']);

app.directive("ecuViewport", ["$timeout", function($timeout) {
    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element) {
            function generateEcuLayout(ecu, shape) {
                var layoutShapes = [
                    new scope.paper.Shape.Rectangle(shape.bounds),
                ];
                layoutShapes[0].fillColor = ecu.couleur;

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
                    ecu.layoutShapes = generateEcuLayout(scope.ecu, shape);

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

            element.on("click", function(event){
                if (paper) {
                    var canvasClick = new paper.Point(event.offsetX, event.offsetY);
                    var hitResult = paper.project.hitTest(canvasClick);
                    console.log(hitResult);
                    if (hitResult) scope.ecu.selectedPart = hitResult.item;
                }
            });

            scope.$watch("ecu.couleur", function(newVal) {
                console.log(scope.ecu);
                if(scope.ecu.selectedPart) scope.ecu.selectedPart.fillColor = newVal;
            });
        }
    }
}]);

app.controller('EcuCtrl', function($scope) {
  $scope.Couleurs = Couleurs;
  $scope.Partitions = Partitions;

  $scope.ecu = new Ecu();
});
