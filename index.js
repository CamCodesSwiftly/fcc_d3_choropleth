let l = function () {
	console.log.apply(console, arguments);
};

import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";
const body = document.querySelector("body");

let educationData = [];

fetch(
	"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
)
	.then((response) => response.json())
	.then((fetchedEducationData) => {
		// // Handle data from the first JSON file
		educationData = fetchedEducationData.slice();

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

		// CONVERT TO GEOJSON DATA
		let countiesGJSON = topojson.feature(usTJSON, countiesTJSON);
		const statesGJSON = topojson.feature(usTJSON, statesTJSON).features;
		const nationGJSON = topojson.feature(usTJSON, nationTJSON).features[0];

		// Merge ALL Education Data with County Data
		for (const countyElement of countiesGJSON.features) {
			//Find corresponding edu object
			const correspondingElement = educationData.find(
				(educationElement) => educationElement.fips == countyElement.id
			);
			//Merge
			countyElement.properties = correspondingElement;
		}
		console.log(countiesGJSON);

		for (let i = 0; i < 10; i++) {}

		// This link will lead to the solution:
		// https://observablehq.com/@d3/choropleth/2?intent=fork

		//lets plot
		const plot = Plot.plot({
			projection: "identity",
			width: 975,
			height: 610,
			color: {
				type: "quantize",
				n: 8,
				domain: [1, 80],
				scheme: "blues",
				label: "Education (%)",
				legend: true,
			},
			marks: [
				Plot.geo(countiesGJSON, {
					fill: (d) => d.properties.bachelorsOrHigher,
					title: (d) =>
						`${d.properties.area_name}, ${d.properties.state}: ${d.properties.bachelorsOrHigher}`,
				}),
				Plot.geo(
					topojson.mesh(
						usTJSON,
						usTJSON.objects.states,
						(a, b) => a !== b
					),
					{ stroke: "white" }
				),
			],
		});
		body.append(plot);
	})
	.catch((error) => {
		// Handle errors
		console.error("Error fetching JSON:", error);
	});
