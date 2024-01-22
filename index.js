const body = document.querySelector("body");
let educationData = [];
// Define the width and height of the SVG canvas
const width = 960;
const height = 600;

// Create an SVG container
const svg = d3
	.select("body") // You can select another container if needed
	.append("svg")
	.attr("width", width)
	.attr("height", height);

// Choose a suitable projection (e.g., Albers USA)
const projection = d3
	.geoAlbersUsa()
	.translate([width / 2, height / 2])
	.scale(1000);

// Create a path generator
const path = d3.geoPath().projection(projection);

// fetch(
// 	"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
// )
fetch(
	"https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
)
	.then((response) => response.json())
	.then((world) => {
		// Handle data from the first JSON file
		console.log(world);
		// educationData = [...educationTJSON];

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

		// GEOJSON DATA
		const countiesGJSON = topojson.feature(usTJSON, countiesTJSON).features;
		const statesGJSON = topojson.feature(usTJSON, statesTJSON).features;
		const nationGJSON = topojson.feature(usTJSON, nationTJSON).features[0];
	})
	.catch((error) => {
		// Handle errors
		console.error("Error fetching JSON:", error);
	});
