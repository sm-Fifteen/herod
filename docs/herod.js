(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("app.js", function(exports, require, module) {
"use strict";

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _angular = require("angular");

var _angular2 = _interopRequireDefault(_angular);

require("angular-ui-bootstrap");

var _paper = require("paper");

var _paper2 = _interopRequireDefault(_paper);

var _ressources = require("ressources");

var _ressources2 = _interopRequireDefault(_ressources);

var _ecu = require("ecu");

var _ecu2 = _interopRequireDefault(_ecu);

var _geometry = require("geometry");

var _geometry2 = _interopRequireDefault(_geometry);

var _tableAttente = require("table-attente");

var _tableAttente2 = _interopRequireDefault(_tableAttente);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = _angular2.default.module("herod", ["ui.bootstrap"]);

window.DEBUG = 0;

window.setup = true;

app.directive("ecuViewport", ["$timeout", function ($timeout) {
	return {
		restrict: "A",
		scope: true,
		link: function link(scope, element) {
			function generatePartitionLayout(champ, shape) {
				var layoutShapes = [];

				champ.partition.cuts.forEach(function (cut) {
					// TODO: destructure returnList
					var returnList = _geometry2.default.slice(_paper2.default, shape, cut, champ.table.points);
					layoutShapes.push(returnList[1]);
					shape = returnList[0];
				});

				layoutShapes.push(shape);

				layoutShapes.forEach(function (partShape, idx) {
					var partObj = champ.children[idx];
					partObj.shape = partShape;
					partShape.fillColor = partObj.couleur;
				});

				return layoutShapes;
			}

			function debugTableAttente(paperShape) {
				var table = _tableAttente2.default.generateTable(_paper2.default, paperShape);
				var regions = table.regions;
				var points = table.points;

				regions.forEach(function (region, idx) {
					region.intersect(paperShape).fillColor = '#' + idx * 11 + '' + idx * 11 + '' + idx * 11;
				});

				_lodash2.default.forIn(points, function (point, key) {
					console.log(key + " : " + point);
					var pointShape = new _paper2.default.Path.Circle({
						center: point,
						radius: 4,
						fillColor: 'red'
					});
					var pointText = new _paper2.default.PointText({
						point: point,
						content: key,
						fillColor: 'red',
						fontFamily: 'Courier New',
						fontWeight: 'bold',
						fontSize: 12
					});
				});
			}

			function drawEcuOn(passedElement) {
				if (window.setup) {
					_paper2.default.setup(passedElement);
					delete window.setup;
				}

				if (scope.ecu) {
					var shape = _paper2.default.PathItem.create(scope.ecu.forme);
					shape.fitBounds(_paper2.default.view.bounds);

					if (!scope.ecu.champ.table) {
						// TODO : Use a watch on ecu.forme instead
						scope.ecu.champ.table = _tableAttente2.default.generateTable(_paper2.default, shape);
					}

					scope.ecu.layoutShapes = generatePartitionLayout(scope.ecu.champ, shape.clone());
					console.log(scope.ecu.layoutShapes);

					// debugTableAttente(shape);
				}

				_paper2.default.view.draw();
			}

			// Timeout with 0 delay, to wait for the DOM to render.
			$timeout(drawEcuOn(element[0]), 0);

			_paper2.default.view.onMouseDown = function (event) {
				var hitResult = _paper2.default.project.hitTest(event.point);

				if (hitResult && _lodash2.default.includes(scope.ecu.layoutShapes, hitResult.item)) {
					scope.$apply(function () {
						scope.ecu.selectedShape = hitResult.item;
					});
				}
			};

			scope.$watch("ecu.champ.partition", function (newVal, oldVal) {
				if (newVal === oldVal) return;

				// Redraw the whole thing on partition change
				_paper2.default.project.clear();
				drawEcuOn(element[0]);

				if (scope.ecu.selectedPart) {
					scope.ecu.selectedShape = scope.ecu.selectedPart.shape;
					scope.ecu.selectedShape.selected = true;
				}
			});
		}
	};
}]);

app.controller("EcuCtrl", function ($scope) {
	$scope.Couleurs = _ressources2.default.couleurs;
	$scope.Partitions = _ressources2.default.partitions;

	$scope.ecu = new _ecu2.default();

	$scope.$watch("ecu.selectedShape", function (newVal, oldVal) {
		if (!newVal) return; // Might be undefined when starting up
		if (oldVal) oldVal.selected = false;
		newVal.selected = true;

		$scope.ecu.selectedPart = _lodash2.default.find($scope.ecu.champ.children, function (elem) {
			return elem.shape === newVal;
		});
	});

	$scope.$watch("ecu.selectedPart.couleur", function (newVal) {
		// If selecedPart is empty, an object is created by angular with no associated shape
		if (_lodash2.default.get($scope.ecu.selectedPart, "shape")) {
			$scope.ecu.selectedPart.shape.fillColor = newVal;
		}
	});
});
});

require.register("ecu.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ressources = require("ressources");

var _ressources2 = _interopRequireDefault(_ressources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ecu = function Ecu() {
	_classCallCheck(this, Ecu);

	this.forme = _ressources2.default.formes.ecuFrancais;
	this.champ = Ecu.testPartitionGroup;

	this.selectedShape = undefined; // A paper shape, added by the directive
	this.selectedPart = undefined; // The partition represented by that shape, added by the controller
};

Ecu.testPartitionGroup = {
	partition: _ressources2.default.partitions.ecartele,
	// table: new TableAttente(),
	children: [{ couleur: _ressources2.default.couleurs.azur }, { couleur: _ressources2.default.couleurs.sable }, { couleur: _ressources2.default.couleurs.sable }, { couleur: _ressources2.default.couleurs.azur }]
};

exports.default = Ecu;
});

require.register("geometry.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Geometry = function () {
	function Geometry() {
		_classCallCheck(this, Geometry);
	}

	_createClass(Geometry, null, [{
		key: "extrapolateLine",
		value: function extrapolateLine(paper, paperShape, origin, lineEnd) {
			var lineStart = lineEnd.clone().rotate(180, origin);
			var line = new paper.Path.Line(lineEnd, lineStart);

			var hScale = 0,
			    vScale = 0;

			if (line.bounds.width >= 1) {
				hScale = (paperShape.bounds.width + Math.abs(paperShape.bounds.center.x - origin.x) * 2) / line.bounds.width;
			}

			if (line.bounds.height >= 1) {
				vScale = (paperShape.bounds.height + Math.abs(paperShape.bounds.center.y - origin.y) * 2) / line.bounds.height;
			}

			var scaleFactor = Math.max(hScale, vScale);
			return line.scale(scaleFactor, origin);
		}
	}, {
		key: "edgeScan",
		value: function edgeScan(paper, paperShape, origin, lineEnd) {
			var line = this.extrapolateLine(paper, paperShape, origin, lineEnd);

			// Return in order of the line's direction
			return _lodash2.default.map(paperShape.getIntersections(line), "point").sort(function (point1, point2) {
				return lineEnd.getDistance(point2) - lineEnd.getDistance(point1);
			});
		}
	}, {
		key: "divideSurface2D",
		value: function divideSurface2D(paper, paperShape, divisionsPerAxis) {
			// TODO: StopFinder is wrong, and doesn't actually create 9 equal shapes like we need.

			var stopsX = this.divideSurface(paper, paperShape, divisionsPerAxis);
			// Flip the shape to get the Y axis
			var viewOrigin = paper.view.bounds.topLeft;
			paperShape.scale(1, -1, viewOrigin).rotate(90, viewOrigin);

			var stopsY = this.divideSurface(paper, paperShape, divisionsPerAxis);
			paperShape.scale(1, -1, viewOrigin).rotate(90, viewOrigin);

			return { x: stopsX, y: stopsY };
		}
	}, {
		key: "divideSurface",
		value: function divideSurface(paper, paperShape, divisionsNeeded) {
			var stopsNeeded = divisionsNeeded - 1;
			var targetArea = Math.abs(paperShape.area / divisionsNeeded); // Area may be negative (??)
			var tolerence = targetArea / 200;
			var stops = [paperShape.bounds.left];

			for (var stop = 1; stop <= stopsNeeded; stop++) {
				var regionStart = stops[stop - 1];
				// We divide in 3, find the first stop, then the rest in half and find the second stop.
				var estimateSize = paperShape.bounds.width / (divisionsNeeded - stop + 1);
				var maskSize = new paper.Size(estimateSize, paperShape.bounds.height);

				var i = 0;
				while (true) {
					var divisionMask = new paper.Path.Rectangle(new paper.Point(regionStart, paperShape.bounds.y), maskSize);
					var estimateArea = new paper.Path(divisionMask.intersect(paperShape).pathData).area;
					var estimateError = targetArea - estimateArea;

					if (Math.abs(estimateError) < tolerence) {
						stops[stop] = divisionMask.bounds.right;
						break;
					}

					// Measure the cross-section width/height of our shape
					var intersections = paperShape.getIntersections(new paper.Path.Line({
						// We seek along the x axis, so the limit of our estimate is always on the right
						from: [divisionMask.bounds.right, paperShape.bounds.top],
						to: [divisionMask.bounds.right, paperShape.bounds.bottom]
					}));

					var normalWidth = intersections[0].point.getDistance(intersections.reverse()[0].point);
					maskSize.width += estimateError / normalWidth / 2;
				}
				stops[stopsNeeded + 1] = paperShape.bounds.right;
			}

			return stops;
		}
	}, {
		key: "slice",
		value: function slice(paper, paperShape, cut, pointsRef) {
			var line = new paper.Path();

			cut.forEach(function (cutPoint) {
				return line.add(pointsRef[cutPoint]);
			});

			var intersections = [paperShape.getNearestLocation(pointsRef[cut[0]]), paperShape.getNearestLocation(pointsRef[cut.reverse()[0]])];

			var curve = intersections[1].curve;
			var newPath = curve.splitAt(intersections[1]);

			// Path is open but hasn't been split in 2
			if (newPath === paperShape) {
				curve = intersections[0].curve;
				newPath = curve.splitAt(intersections[0]);
			}

			// First is the leftover paperShape, second is the piece we wanted
			// The one that fills the inside of our intersections is our piece.
			// For simplicity's sake, we use path length to guess that.

			var returnList = [paperShape, newPath];
			if (paperShape.length < newPath.length) {
				returnList = [newPath, paperShape];
			}

			paperShape.join(line.clone(), 5);
			paperShape.closePath();
			newPath.join(line.clone(), 5);
			newPath.closePath();

			return returnList;
		}
	}]);

	return Geometry;
}();

exports.default = Geometry;
});

require.register("ressources.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var R = {
	formes: {
		ecuFrancais: "M0,0 L0,50 Q0,80 50,110 Q100,80 100,50 L100,0 z"
	},

	couleurs: {
		azur: "#2b5df2",
		sable: "#000000",
		sinople: "#5ab532",
		pourpre: "#d576ad",
		or: "#fcef3c",
		argent: "#ffffff"
	},

	divisionModel: {
		axisAligned: "stripes",
		aroundCenter: "slices"
	},

	// divisionModel + nbDivisions + rotation
	// partGroup = new Partition.Tierce.Pal()

	partitions: {
		parti: {
			cuts: [["pointChef", "pointPointe"]],
			nameFr: ["Parti"]
		},
		coupe: {
			cuts: [["flancDextre", "flancSenestre"]],
			nameFr: ["Coupé"]
		},
		tranche: {
			cuts: [["chefDextre", "pointeSenestre"]],
			nameFr: ["Tranché"]
		},
		taille: {
			cuts: [["chefSenestre", "pointeDextre"]],
			nameFr: ["Taillé"]
		},
		ecartele: {
			cuts: [["flancDextre", "abyme", "pointChef"], ["pointChef", "abyme", "flancSenestre"], ["flancDextre", "abyme", "pointPointe"]]
		},
		ecarteleSautoir: {
			cuts: [["chefDextre", "abyme", "chefSenestre"], ["chefDextre", "abyme", "pointeDextre"], ["chefSenestre", "abyme", "pointeSenestre"]]
		},
		tiercePairle: {
			cuts: [["chefDextre", "abyme", "chefSenestre"], ["chefDextre", "abyme", "pointPointe"], ["chefSenestre", "abyme", "pointPointe"]]
		},
		tiercePairleInv: {
			cuts: [["pointeDextre", "abyme", "pointChef"], ["pointeSenestre", "abyme", "pointChef"], ["pointeDextre", "abyme", "pointeSenestre"]]
		}
	}
};

exports.default = R;
});

require.register("table-attente.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _geometry = require("geometry");

var _geometry2 = _interopRequireDefault(_geometry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TableAttente = function () {
	function TableAttente(points, regions) {
		_classCallCheck(this, TableAttente);

		this.points = points;
		this.regions = regions;
		// this.directions = {};
	}

	_createClass(TableAttente, null, [{
		key: "generateTable",
		value: function generateTable(paper, paperShape) {
			return new TableAttente(TableAttente.generatePoints(paper, paperShape), TableAttente.generateRegions(paper, paperShape));
		}
	}, {
		key: "generatePoints",
		value: function generatePoints(paper, paperShape) {
			var stops = _geometry2.default.divideSurface2D(paper, paperShape, 2);

			var center = new paper.Point(stops.x[1], stops.y[1]);

			var parti = _geometry2.default.edgeScan(paper, paperShape, center, new paper.Point(stops.x[1], stops.y[2]));
			var coupe = _geometry2.default.edgeScan(paper, paperShape, center, new paper.Point(stops.x[2], stops.y[1]));
			var tranche = _geometry2.default.edgeScan(paper, paperShape, new paper.Point(stops.x[0], stops.y[0]), center);
			var taille = _geometry2.default.edgeScan(paper, paperShape, new paper.Point(stops.x[2], stops.y[0]), center);

			return {
				pointChef: parti[0],
				pointPointe: parti.reverse()[0],

				// Dexter and Sinister are the left and right of the bearer.
				// They are reversed here.
				flancDextre: coupe[0],
				flancSenestre: coupe.reverse()[0],
				chefDextre: tranche[0],
				pointeSenestre: tranche.reverse()[0],
				chefSenestre: taille[0],
				pointeDextre: taille.reverse()[0],

				abyme: center
			};
		}
	}, {
		key: "generateRegions",
		value: function generateRegions(paper, paperShape) {
			var divisionsPerAxis = 3;
			var stops = _geometry2.default.divideSurface2D(paper, paperShape, divisionsPerAxis);

			var regionMasks = [];
			for (var i = 0; i < divisionsPerAxis; i++) {
				var y1 = stops.y[i],
				    y2 = stops.y[i + 1];

				for (var j = 0; j < divisionsPerAxis; j++) {
					var x1 = stops.x[j],
					    x2 = stops.x[j + 1];

					regionMasks.push(new paper.Path.Rectangle({
						from: [x1, y1],
						to: [x2, y2]
					}));
				}
			}

			return regionMasks;
		}
	}]);

	return TableAttente;
}();

exports.default = TableAttente;
});

require.alias("buffer/index.js", "buffer");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('app');
//# sourceMappingURL=herod.js.map