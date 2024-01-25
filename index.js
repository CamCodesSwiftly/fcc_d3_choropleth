// * BASIC SETUP
const d3 = require("d3");
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
		// * DATA HANDLING
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

		// * PLOTTING
		// This link will lead to the solution:
		// https://observablehq.com/@d3/choropleth/2?intent=fork
		// * SETUP
		const color = d3.scaleQuantize([1, 10], d3.schemeBlues[9]);
		const path = d3.geoPath();
		const format = (d) => `${d}%`;
		const valuemap = new Map(
			educationData.map((d) => [d.fips, d.bachelorsOrHigher])
		);
		// TODO: Prepare Data

		// * CREATE SVG
		const svg = d3
			.create("svg")
			.attr("width", 975)
			.attr("height", 610)
			.attr("viewBox", [0, 0, 975, 610])
			.attr("style", "max-width: 100%; height: auto;");

		// TODO: Legend

		// TODO: Plot counties and tooltip

		// TODO: Plot statemesh

		// ? CONSOLE LOG AREA
	})
	.catch((error) => {
		// Handle errors
		console.error("Error fetching JSON:", error);
	});
