var app = angular.module('herod', ['ui.bootstrap']);

app.directive("ecuViewport", ["$timeout", function($timeout) {
    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element) {
            function drawEcuOn(passedElement){
                if(!scope.paper) {
                    scope.paper = new paper.PaperScope();
                    scope.paper.setup(passedElement);
                }

                if(scope.ecu) {
                    scope.shape = scope.paper.PathItem.create(scope.ecu.forme);
                    scope.shape.fitBounds(scope.paper.view.bounds);
                    scope.shape.fillColor = scope.ecu.couleur;
                }

                paper = scope.paper;
                paper.view.draw();
            }

            // Timeout with 0 delay, to wait for the DOM to render.
            $timeout(drawEcuOn(element[0]), 0);

            scope.$watch("ecu.couleur", function(newVal) {
                scope.shape.fillColor = newVal;
            });
        }
    }
}]);

app.controller('EcuCtrl', function($scope) {
  $scope.Couleurs = Couleurs;
  $scope.Partitions = Partitions;
  console.log($scope.Couleurs);

  $scope.ecu = new Ecu();
});
