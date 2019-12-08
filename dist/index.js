(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var example_randomCentroids = [[1, 3], [5, 8], [3, 0]];

var example_2d3k = [[1, 2], [2, 3], [2, 5], [1, 6], [4, 6], [3, 5], [2, 4], [4, 3], [5, 2], [6, 9], [4, 4], [3, 3], [8, 6], [7, 5], [9, 6], [9, 7], [8, 8], [7, 9], [11, 3], [11, 2], [9, 9], [7, 8], [6, 8], [12, 2], [14, 3], [15, 1], [15, 4], [14, 2], [13, 1], [16, 4]];

exports.default = {
    example_randomCentroids: example_randomCentroids,
    example_2d3k: example_2d3k
};

},{}],2:[function(require,module,exports){
'use strict';

var _kmeans = require('./kmeans.js');

var _kmeans2 = _interopRequireDefault(_kmeans);

var _data = require('./data.js');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log("Solving example: 2d data with 3 clusters:");
console.log("===============================================\n");

console.log("Solution for 2d data with 3 clusters:");
console.log("-------------------------------------");
var ex_1_solver = new _kmeans2.default(3, _data2.default.example_2d3k);
var ex_1_centroids = ex_1_solver.solve();
console.log(ex_1_centroids);
console.log("");

},{"./data.js":1,"./kmeans.js":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Calculate the mean of an array of numbers.
 * @param {Array.<number>} numbers
 * @return {number}
 */
var mean = function mean(numbers) {
    return numbers.reduce(function (sum, val) {
        return sum + val;
    }, 0) / numbers.length;
};

/**
 * Calculate the distance between two points.
 * Points must be given as arrays or objects with equivalent keys.
 * @param {Array.<number>} a
 * @param {Array.<number>} b
 * @return {number}
 */
var distance = function distance(a, b) {
    return Math.sqrt(a.map(function (aPoint, i) {
        return b[i] - aPoint;
    }).reduce(function (sumOfSquares, diff) {
        return sumOfSquares + diff * diff;
    }, 0));
};

var KMeans = function () {

    /**
     * @param k
     * @param data
     */
    function KMeans(k, data) {
        _classCallCheck(this, KMeans);

        this.k = k;
        this.data = data;
        this.reset();
    }

    /**
     * Resets the solver state; use this if you wish to run the
     * same solver instance again with the same data points
     * but different initial conditions.
     */


    _createClass(KMeans, [{
        key: "reset",
        value: function reset() {
            this.error = null;
            this.iterations = 0;
            this.iterationLogs = [];
            this.centroids = this.initRandomCentroids();
            this.centroidAssignments = [];
        }

        /**
        * Determines the number of dimensions in the dataset.
        * @return {number}
        */

    }, {
        key: "getDimensionality",
        value: function getDimensionality() {
            var point = this.data[0];
            return point.length;
        }

        /**
        * For a given dimension in the dataset, determine the minimum
        * and maximum value. This is used during random initialization
        * to make sure the random centroids are in the same range as
        * the data.
        *
        * @param n
        * @returns {{min: *, max: *}}
        */

    }, {
        key: "getRangeForDimension",
        value: function getRangeForDimension(n) {
            var values = this.data.map(function (point) {
                return point[n];
            });
            return {
                min: Math.min.apply(null, values),
                max: Math.max.apply(null, values)
            };
        }

        /**
         * Get ranges for all dimensions.
        * @see getRangeForDimension
        * @returns {Array} Array whose indices are the dimension number and whose members are the output of getRangeForDimension
        */

    }, {
        key: "getAllDimensionRanges",
        value: function getAllDimensionRanges() {
            var dimensionRanges = [];
            var dimensionality = this.getDimensionality();

            for (var dimension = 0; dimension < dimensionality; dimension++) {
                dimensionRanges[dimension] = this.getRangeForDimension(dimension);
            }

            return dimensionRanges;
        }

        /**
        * Initializes random centroids, using the ranges of the data
        * to set minimum and maximum bounds for the centroids.
        * You may inspect the output of this method if you need to debug
        * random initialization, otherwise this is an internal method.
        * @see getAllDimensionRanges
        * @see getRangeForDimension
        * @returns {Array}
        */

    }, {
        key: "initRandomCentroids",
        value: function initRandomCentroids() {

            var dimensionality = this.getDimensionality();
            var dimensionRanges = this.getAllDimensionRanges();
            var centroids = [];

            // We must create 'k' centroids.
            for (var i = 0; i < this.k; i++) {

                // Since each dimension has its own range, create a placeholder at first
                var point = [];

                /**
                 * For each dimension in the data find the min/max range of that dimension,
                 * and choose a random value that lies within that range. 
                 */
                for (var dimension = 0; dimension < dimensionality; dimension++) {
                    var _dimensionRanges$dime = dimensionRanges[dimension],
                        min = _dimensionRanges$dime.min,
                        max = _dimensionRanges$dime.max;

                    point[dimension] = min + Math.random() * (max - min);
                }

                centroids.push(point);
            }

            return centroids;
        }

        /**
        * Given a point in the data to consider, determine the closest
        * centroid and assign the point to that centroid.
        * The return value of this method is a boolean which represents
        * whether the point's centroid assignment has changed;
        * this is used to determine the termination condition for the algorithm.
        * @param pointIndex
        * @returns {boolean} Did the point change its assignment?
        */

    }, {
        key: "assignPointToCentroid",
        value: function assignPointToCentroid(pointIndex) {

            var lastAssignedCentroid = this.centroidAssignments[pointIndex];
            var point = this.data[pointIndex];
            var minDistance = null;
            var assignedCentroid = null;

            for (var i = 0; i < this.centroids.length; i++) {
                var centroid = this.centroids[i];
                var distanceToCentroid = distance(point, centroid);

                if (minDistance === null || distanceToCentroid < minDistance) {
                    minDistance = distanceToCentroid;
                    assignedCentroid = i;
                }
            }

            this.centroidAssignments[pointIndex] = assignedCentroid;

            return lastAssignedCentroid !== assignedCentroid;
        }

        /**
        * For all points in the data, call assignPointsToCentroids
        * and returns whether _any_ point's centroid assignment has
        * been updated.
        *
        * @see assignPointToCentroid
        * @returns {boolean} Was any point's centroid assignment updated?
        */

    }, {
        key: "assignPointsToCentroids",
        value: function assignPointsToCentroids() {
            var didAnyPointsGetReassigned = false;
            for (var i = 0; i < this.data.length; i++) {
                var wasReassigned = this.assignPointToCentroid(i);
                if (wasReassigned) didAnyPointsGetReassigned = true;
            }
            return didAnyPointsGetReassigned;
        }

        /**
        * Given a centroid to consider, returns an array
        * of all points assigned to that centroid.
        *
        * @param centroidIndex
        * @returns {Array}
        */

    }, {
        key: "getPointsForCentroid",
        value: function getPointsForCentroid(centroidIndex) {
            var points = [];
            for (var i = 0; i < this.data.length; i++) {
                var assignment = this.centroidAssignments[i];
                if (assignment === centroidIndex) {
                    points.push(this.data[i]);
                }
            }
            return points;
        }

        /**
        * Given a centroid to consider, update its location to
        * the mean value of the positions of points assigned to it.
        * @see getPointsForCentroid
        * @param centroidIndex
        * @returns {Array}
        */

    }, {
        key: "updateCentroidLocation",
        value: function updateCentroidLocation(centroidIndex) {
            var thisCentroidPoints = this.getPointsForCentroid(centroidIndex);
            var dimensionality = this.getDimensionality();
            var newCentroid = [];

            var _loop = function _loop(dimension) {
                newCentroid[dimension] = mean(thisCentroidPoints.map(function (point) {
                    return point[dimension];
                }));
            };

            for (var dimension = 0; dimension < dimensionality; dimension++) {
                _loop(dimension);
            }
            this.centroids[centroidIndex] = newCentroid;
            return newCentroid;
        }

        /**
        * For all centroids, call updateCentroidLocation
        */

    }, {
        key: "updateCentroidLocations",
        value: function updateCentroidLocations() {
            for (var i = 0; i < this.centroids.length; i++) {
                this.updateCentroidLocation(i);
            }
        }

        /**
        * Calculates the total "error" for the current state
         * of centroid positions and assignments.
         * Here, error is defined as the root-mean-squared distance
        * of all points to their centroids.
        * @returns {Number}
         */

    }, {
        key: "calculateError",
        value: function calculateError() {

            var sumDistanceSquared = 0;
            for (var i = 0; i < this.data.length; i++) {
                var centroidIndex = this.centroidAssignments[i];
                var centroid = this.centroids[centroidIndex];
                var point = this.data[i];
                var thisDistance = distance(point, centroid);
                sumDistanceSquared += thisDistance * thisDistance;
            }

            this.error = Math.sqrt(sumDistanceSquared / this.data.length);
            return this.error;
        }

        /**
        * Run the k-means algorithm until either the solver reaches steady-state,
        * or the maxIterations allowed has been exceeded.
        *
        * The return value from this method is an object with properties:
        * {
        *  centroids {Array.<Object>},
        *  iteration {number},
        *  error {number},
        *  didReachSteadyState {Boolean}
        * }
        *
        * You are most likely interested in the centroids property of the output.
        *
        * @param {Number} maxIterations Default 1000
        * @returns {Object}
        */

    }, {
        key: "solve",
        value: function solve() {
            var maxIterations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;


            while (this.iterations < maxIterations) {

                var didAssignmentsChange = this.assignPointsToCentroids();
                this.updateCentroidLocations();
                this.calculateError();

                this.iterationLogs[this.iterations] = {
                    centroids: [].concat(_toConsumableArray(this.centroids)),
                    iteration: this.iterations,
                    error: this.error,
                    didReachSteadyState: !didAssignmentsChange
                };

                if (didAssignmentsChange === false) {
                    break;
                }

                this.iterations++;
            }

            return this.iterationLogs[this.iterationLogs.length - 1];
        }
    }]);

    return KMeans;
}();

exports.default = KMeans;

},{}]},{},[2]);
