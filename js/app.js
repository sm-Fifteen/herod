var app = angular.module('herod', ['ui.bootstrap']);

app.directive("ecuViewport", ["$timeout", function($timeout) {
    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element) {
            function generatePartitionLayout(champ, shape) {
                var layoutShapes = [];

                var table = TableAttente.generateTable(scope.paper, shape);

                var line = new scope.paper.Path.Line(table.points.chefDextre, table.points.pointeSenestre);
                layoutShapes = slice(scope.paper, shape, line);

                layoutShapes.forEach(function(partShape, idx){
                    var partObj = champ.children[idx];
                    partObj.shape = partShape;
                    partShape.fillColor = partObj.couleur;
                });

                return layoutShapes;
            }

            function debugTableAttente(paperShape) {
                var table = TableAttente.generateTable(scope.paper, paperShape);
                var regions = table.regions;
                var points = table.points;

                regions.forEach(function(region, idx){
                    region.intersect(paperShape).fillColor = '#'+idx*11+''+idx*11+''+idx*11;
                });

                _.forIn(points, function(point, key) {
                    console.log(key + " : " + point);
                    var pointShape = new scope.paper.Path.Circle({
                        center: point,
                        radius: 4,
                        fillColor: 'red',
                    });
                    var pointText = new scope.paper.PointText({
                        point: point,
                        content: key,
                        fillColor: 'red',
                        fontFamily: 'Courier New',
                        fontWeight: 'bold',
                        fontSize: 12,
                    });
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

                    var table = TableAttente.generateTable(scope.paper, shape);

                    ecu.layoutShapes = generatePartitionLayout(scope.ecu.champ, shape, table);

                    console.log(ecu.layoutShapes);

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
