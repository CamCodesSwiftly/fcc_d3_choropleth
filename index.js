fetch(
	"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
)
	.then((response) => response.json())
	.then((data1) => {
		// Handle data from the first JSON file
		console.log("Education Data:", data1);

		// Fetch the second JSON file
		return fetch(
			"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
		);
	})
	.then((response) => response.json())
	.then((data2) => {
		// Handle data from the second JSON file
		console.log("County Data:", data2);

		// Continue with your code...
	})
	.catch((error) => {
		// Handle errors
		console.error("Error fetching JSON:", error);
	});
