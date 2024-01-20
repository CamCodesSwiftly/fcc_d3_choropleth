const body = document.querySelector("body");
const w = 1200;
const h = 600;
const padding = 90;
const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

fetch(
	"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
	.then((response) => response.json())
	.then((data) => {
		const myData = data.monthlyVariance;
		myData.forEach((entry) => {
			entry.month -= 1;
		});
		// * SVG
		const svg = d3
			.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

		// * X SCALE & AXIS
		const xScale = d3
			.scaleLinear()
			.domain(d3.extent(myData, (d) => d.year))
			.range([padding, w - padding]);
		const xAxis = d3
			.axisBottom(xScale)
			.tickValues(d3.range(1753, 2014, 10))
			.tickFormat((d) => d);
		svg.append("g")
			.attr("transform", "translate(0," + (h - 125) + ")")
			.attr("id", "x-axis")
			.call(xAxis);

		// * Y SCALE & AXIS
		const yScale = d3
			.scaleBand()
			.domain(d3.range(0, 12).reverse())
			.range([h - padding - 39, padding - 39]);
		const yAxis = d3.axisLeft(yScale).tickFormat((d) => {
			return monthNames[d];
		});
		svg.append("g")
			.attr("transform", "translate(" + padding + ", 0)")
			.attr("id", "y-axis")
			.call(yAxis);

		// * TOOLTIP
		let tooltip = d3
			.select("body")
			.data(myData)
			.append("div")
			.attr("id", "tooltip");

		function handleMouseOver() {
			const year = d3.select(this).attr("data-year");
			const month = d3.select(this).attr("data-month");
			const temp = d3.select(this).attr("data-temp");

			d3.select(this).style("stroke", "black").style("stroke-width", 2);
			tooltip
				.transition()
				.duration(200)
				.style("opacity", 0.9)
				.attr("data-year", year);
			return tooltip
				.html(
					`<p>${year} - ${monthNames[month - 1]}</p><p>${(
						8.66 - temp
					).toFixed(1)}°C</p><p>${(temp + 1 - 1).toFixed(1)}°C</p>`
				)
				.style("left", event.pageX + 30 + "px")
				.style("top", event.pageY + -50 + "px");
		}

		function handleMouseOut() {
			tooltip.transition().duration(200).style("opacity", 0);
			d3.select(this).style("stroke", "black").style("stroke-width", 0);
		}

		// * GRAPH
		const varianceExtent = d3.extent(myData, (d) => d.variance);
		const colorScale = d3
			.scaleSequential()
			.domain(varianceExtent)
			.interpolator(d3.interpolatePlasma);
		svg.selectAll("rect")
			.data(myData)
			.enter()
			.append("rect")
			.attr("class", "cell")
			.attr("data-year", (d) => d.year)
			.attr("data-month", (d) => d.month)
			.attr("data-temp", (d) => d.variance)
			.attr("x", (d) => xScale(d.year))
			.attr("y", (d) => yScale(d.month))
			.attr("width", 5)
			.attr("height", 39)
			.style("fill", (d) => colorScale(d.variance))

			.on("mouseover", handleMouseOver)
			.on("mouseout", handleMouseOut);

		//* LEGEND
		const legendWidth = 600;
		const legendHeight = 40;

		const legendColorScale = d3
			.scaleSequential()
			.domain([2.8, 12.8])
			.interpolator(d3.interpolatePlasma);

		const legendSvg = d3
			.select("body")
			.append("svg")
			.attr("width", legendWidth)
			.attr("height", legendHeight)
			.attr("transform", "translate(100, 0)")
			.attr("id", "legend");

		const legendColors = d3
			.ticks(2.8, 12.8, 9)
			.map((d) => legendColorScale(d));

		const legendRectWidth = legendWidth / legendColors.length;

		legendSvg
			.selectAll("rect")
			.data(legendColors)
			.enter()
			.append("rect")
			.attr("x", (d, i) => i * legendRectWidth)
			.attr("y", 0)
			.attr("width", legendRectWidth)
			.attr("height", legendHeight - 20)
			.style("fill", (d) => d);

		const legendAxis = d3
			.axisBottom(
				d3.scaleLinear().range([0, legendWidth]).domain([2, 14])
			)
			.tickValues(d3.range(2.8, 13, 2))
			.tickFormat(d3.format(".1f"));

		legendSvg
			.append("g")
			.attr("transform", "translate(0, 20)")
			.call(legendAxis);
	});
