import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";
const body = document.querySelector("body");

let educationData = [];
// // Define the width and height of the SVG canvas
// const width = 960;
// const height = 600;

// // Create an SVG container
// const svg = d3
// 	.select("body") // You can select another container if needed
// 	.append("svg")
// 	.attr("width", width)
// 	.attr("height", height);

// // Choose a suitable projection (e.g., Albers USA)
// const projection = d3
// 	.geoAlbersUsa()
// 	.translate([width / 2, height / 2])
// 	.scale(1000);

// // Create a path generator
// const path = d3.geoPath().projection(projection);

fetch(
	"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
)
	.then((response) => response.json())
	.then((educationData) => {
		// Handle data from the first JSON file
		console.log("Education:", educationData);
		// Fetch the second JSON file
		return fetch(
			"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
		);
	})
	.then((response) => response.json())
	.then((usTJSON) => {
		// Continue with your code...
		// TOPOJSON DATA
		const countiesTJSON = usTJSON.objects.counties;
		const statesTJSON = usTJSON.objects.states;
		const nationTJSON = usTJSON.objects.nation;
		console.log("TopoJSON:", usTJSON);

		// GEOJSON DATA
		const countiesGJSON = topojson.feature(usTJSON, countiesTJSON).features;
		const statesGJSON = topojson.feature(usTJSON, statesTJSON).features;
		const nationGJSON = topojson.feature(usTJSON, nationTJSON).features[0];
		console.log("GeoJSON counties:", countiesGJSON);
		console.log("GeoJSON states:", statesGJSON);
		console.log("GeoJSON nation:", nationGJSON);

		// This link will lead to the solution:
		// https://observablehq.com/@d3/choropleth/2?intent=fork

		//lets plot
		const plot = Plot.plot({
			projection: "albers-usa",
			color: {
				type: "quantile",
				n: 9,
				scheme: "blues",
				label: "Education (%)",
				legend: true,
			},
			marks: [
				Plot.geo(counties, {
					fill: (d) => d.properties.bachelorOrHigher,
					title: (d) =>
						`${d.properties.countyName}, ${d.properties.statenNameAbgekuerzt}: ${d.properties.bachelorOrHigher}`,
				}),
			],
		});
		body.append(plot);
	})
	.catch((error) => {
		// Handle errors
		console.error("Error fetching JSON:", error);
	});
