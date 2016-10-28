import _ from "lodash";
import angular from "angular";
import "angular-ui-bootstrap";
import paper from "paper";

import R from "ressources";
import Ecu from "ecu";
import Geometry from "geometry";
import TableAttente from "table-attente";

let app = angular.module("herod", ["ui.bootstrap"]);

window.DEBUG = 0;

window.setup = true;

app.directive("ecuViewport", ["$timeout", function ($timeout) {
	return {
		restrict: "A",
		scope: true,
		link: function (scope, element) {
			function generatePartitionLayout(champ, shape) {
				let layoutShapes = [];

				champ.partition.cuts.forEach(function (cut) {
					// TODO: destructure returnList
					let returnList = Geometry.slice(paper, shape, cut, champ.table.points);
					layoutShapes.push(returnList[1]);
					shape = returnList[0];
				});

				layoutShapes.push(shape);

				layoutShapes.forEach(function (partShape, idx){
					let partObj = champ.children[idx];
					partObj.shape = partShape;
					partShape.fillColor = partObj.couleur;
				});

				return layoutShapes;
			}

			function debugTableAttente(paperShape) {
				let table = TableAttente.generateTable(paper, paperShape);
				let regions = table.regions;
				let points = table.points;

				regions.forEach(function (region, idx) {
					region.intersect(paperShape).fillColor = '#'+idx*11+''+idx*11+''+idx*11;
				});

				_.forIn(points, function (point, key) {
					console.log(key + " : " + point);
					let pointShape = new paper.Path.Circle({
						center: point,
						radius: 4,
						fillColor: 'red',
					});
					let pointText = new paper.PointText({
						point: point,
						content: key,
						fillColor: 'red',
						fontFamily: 'Courier New',
						fontWeight: 'bold',
						fontSize: 12,
					});
				});
			}

			function drawEcuOn(passedElement) {
				if (window.setup) {
					paper.setup(passedElement);
					delete window.setup;
				}

				if (scope.ecu) {
					let shape = paper.PathItem.create(scope.ecu.forme);
					shape.fitBounds(paper.view.bounds);

					if (!scope.ecu.champ.table) {
						// TODO : Use a watch on ecu.forme instead
						scope.ecu.champ.table = TableAttente.generateTable(paper, shape);
					}

					scope.ecu.layoutShapes = generatePartitionLayout(scope.ecu.champ, shape.clone());
					console.log(scope.ecu.layoutShapes);

					// debugTableAttente(shape);
				}

				paper.view.draw();
			}

			// Timeout with 0 delay, to wait for the DOM to render.
			$timeout(drawEcuOn(element[0]), 0);

			paper.view.onMouseDown = function (event) {
				var hitResult = paper.project.hitTest(event.point);

				if (hitResult && _.includes(scope.ecu.layoutShapes, hitResult.item)) {
					scope.$apply(function () {
						scope.ecu.selectedShape = hitResult.item;
					});
				}
			};

			scope.$watch("ecu.champ.partition", function (newVal, oldVal) {
				if(newVal === oldVal) return;

				// Redraw the whole thing on partition change
				paper.project.clear();
				drawEcuOn(element[0]);

				if (scope.ecu.selectedPart) {
					scope.ecu.selectedShape = scope.ecu.selectedPart.shape;
					scope.ecu.selectedShape.selected = true;
				}
			});
		}
	};
}]);

app.controller("EcuCtrl", function($scope) {
	$scope.Couleurs = R.couleurs;
	$scope.Partitions = R.partitions;

	$scope.ecu = new Ecu();

	$scope.$watch("ecu.selectedShape", function(newVal, oldVal) {
		if (!newVal) return; // Might be undefined when starting up
		if (oldVal) oldVal.selected = false;
		newVal.selected = true;

		$scope.ecu.selectedPart = _.find($scope.ecu.champ.children, function (elem) {
			return elem.shape === newVal;
		});
	});

	$scope.$watch("ecu.selectedPart.couleur", function (newVal) {
		// If selecedPart is empty, an object is created by angular with no associated shape
		if (_.get($scope.ecu.selectedPart, "shape")) {
			$scope.ecu.selectedPart.shape.fillColor = newVal;
		}
	});
});
