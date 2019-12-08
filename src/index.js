import KMeans from './kmeans.js';
import example_data from './data.js';

console.log("Solving example: 2d data with 3 clusters:");
console.log("===============================================\n");


console.log("Solution for 2d data with 3 clusters:");
console.log("-------------------------------------");
const ex_1_solver = new KMeans(3, example_data.example_2d3k);
const ex_1_centroids = ex_1_solver.solve();
console.log(ex_1_centroids);
console.log("");