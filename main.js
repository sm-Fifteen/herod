var sizeFactor = 40;

var colors = {
  gueules: '#e20909',
  azur: '#2b5df2',
  sable: '#000000',
  sinople: '#5ab532',
  pourpre: '#d576ad',
  or: '#fcef3c',
  argent: '#ffffff',
};

var draw = SVG('drawing');
$('#drawing').width(10 * sizeFactor).height(11 * sizeFactor);

var ecuPath = 'M0,0 L0,5 Q0,8 5,11 Q10,8 10,5 L10,0 z';

var bg = draw.rect(10 * sizeFactor, 11 * sizeFactor).fill(colors.azur);
var ecu = draw.path(ecuPath).size(10 * sizeFactor);
bg.clipWith(ecu);


var app = angular.module('herod', ['ui.bootstrap']);

app.controller('EcuCtrl', function($scope) {
  $scope.ecu = {
    color: 'azur',
  };

  $scope.colors = colors;

  $scope.$watch('ecu.color', function(color) {
    bg.fill(colors[color]);
  });
});

// http://stackoverflow.com/a/30207330
app.filter('capitalize', function() {
  return function(input) {
    return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  }
});
