var app = angular.module('herod', ['ui.bootstrap']);

app.controller('EcuCtrl', function($scope) {
  $scope.ecu = ecu;
  $scope.Couleurs = Couleurs;
  $scope.Partitions = Partitions;

  $scope.$watch('ecu.couleur', ecu.updateCouleur);
  $scope.$watch('ecu.partition', ecu.updatePartition);
});
