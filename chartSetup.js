import { select, axisLeft, axisBottom, timeParse, timeFormat, extent, scaleTime } from 'd3';

export function chartSetup() {
	const margin = { top: 20, right: 20, bottom: 30, left: 100 };
	const containerHeight = 500;
	const containerWidth = 900;
	let svg = select('svg').attr('width', containerWidth).attr('height', containerHeight);
	let chart = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
	const width = containerWidth - margin.left - margin.right;
	const height = containerHeight - margin.top - margin.bottom;

	return {
		margin,
		svg,
		chart,
		width,
		height,
	};
}

export function addAxes(chart, data, width, height) {
	const parseTimeYear = timeParse('%Y');
	const parseTimeTime = timeParse('%M:%S');

	let xExtent = extent(data, d => parseTimeYear(d.Year));
	xExtent[0] = parseTimeYear(xExtent[0].getFullYear() - 1);
	xExtent[1] = parseTimeYear(xExtent[1].getFullYear() + 1);

	const xScale = scaleTime().domain(xExtent).range([0, width]);

	const yScale = scaleTime()
		.domain(extent(data, d => parseTimeTime(d.Time)))
		.range([0, height]);

	const xAxis = axisBottom(xScale);

	const formatter = timeFormat('%M:%S');

	const yAxis = axisLeft(yScale).tickFormat(d => {
		return formatter(d);
	});

	chart.append('g').attr('transform', `translate(0, ${height})`).call(xAxis);

	chart.append('g').call(yAxis);

	return { xScale, yScale, parseTimeYear, parseTimeTime };
}
