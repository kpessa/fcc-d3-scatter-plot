import { select, axisLeft, axisBottom, timeParse, timeFormat, extent, scaleTime, timeMinute } from 'd3';
import d3 from 'd3';

export function chartSetup() {
	const margin = { top: 100, right: 20, bottom: 30, left: 100 };
	const containerHeight = 500;
	const containerWidth = 900;
	let svg = select('svg').attr('width', containerWidth).attr('height', containerHeight);
	let chart = svg.append('g').attr('id', 'chart').attr('transform', `translate(${margin.left}, ${margin.top})`);
	const graph = chart.append('g').attr('id', 'graph');
	const width = containerWidth - margin.left - margin.right;
	const height = containerHeight - margin.top - margin.bottom;

	svg
		.append('text')
		.attr('id', 'title')
		.attr('x', containerWidth / 2)
		.attr('y', margin.top / 2)
		.text('Doping in Professional Bicycle Racing');

	svg
		.append('text')
		.attr('id', 'subtitle')
		.attr('x', containerWidth / 2)
		.attr('y', margin.top / 2 + 25)
		.text("35 Fastest Times up Alpe d'Huez");

	svg
		.append('text')
		.attr('id', 'y-axis-label')
		.attr('x', -height / 2 - 60)
		.attr('y', margin.left / 2)
		.attr('transform', 'rotate(-90)')
		.text('Time in minutes');

	function addLegend() {
		let legend = chart
			.append('g')
			.attr('id', 'legend')
			.attr('transform', `translate(${width - margin.right}, ${100})`);

		legend.append('rect').attr('class', 'legend-rect').attr('x', 0).attr('y', 0).attr('fill', '#ff7f0e');

		legend
			.append('text')
			.attr('class', 'legend-text')
			.attr('x', -8)
			.attr('y', +12)
			.text('No doping allegations');

		legend.append('rect').attr('class', 'legend-rect').attr('x', 0).attr('y', 25).attr('fill', '#1f77b4');

		legend
			.append('text')
			.attr('class', 'legend-text')
			.attr('x', -8)
			.attr('y', 25 + 12)
			.text('Riders with doping allegations');
	}

	addLegend();

	function addTooltip() {
		select('body').append('div').attr('id', 'tooltip').style('opacity', 0);
	}

	addTooltip();

	return {
		margin,
		svg,
		chart,
		graph,
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

	let yExtent = extent(data, d => parseTimeTime(d.Time));
	// yExtent[0] = timeMinute.floor(yExtent[0]);
	yExtent[1] = timeMinute.ceil(yExtent[1]);

	// yExtent[0] = d3.timeMinute.floor(parseTimeTime(yExtent[0]));
	// yExtent[1] = d3.timeMinute.ceil(parseTimeTime(yExtent[1]));

	const yScale = scaleTime().domain(yExtent).range([0, height]);

	const xAxis = axisBottom(xScale);

	const formatter = timeFormat('%M:%S');

	const yAxis = axisLeft(yScale).tickFormat(d => {
		return formatter(d);
	});

	chart.append('g').attr('id', 'x-axis').attr('transform', `translate(0, ${height})`).call(xAxis);

	chart.append('g').attr('id', 'y-axis').call(yAxis);

	return { xScale, yScale, parseTimeYear, parseTimeTime };
}

export function plotData(graph, data, xScale, yScale, parseTimeYear, parseTimeTime) {
	graph
		.selectAll('circle')
		.data(data)
		.join('circle')
		.attr('class', 'dot')
		.attr('data-year', d => d.Year)
		.attr('data-time', d => d.Time)
		.attr('data-xvalue', d => d.Year)
		.attr('data-yvalue', d => {
			let [minutes, seconds] = d.Time.split(':').map(Number);
			return new Date(0, 0, 0, 0, minutes, seconds);
		})
		.attr('data-name', d => d.Name)
		.attr('data-nationality', d => d.Nationality)
		.attr('data-doping', d => d.Doping)
		.attr('cx', d => xScale(parseTimeYear(d.Year)))
		.attr('cy', d => yScale(parseTimeTime(d.Time)))
		.attr('r', 7)
		.attr('stroke', 'black')
		.attr('fill', d => {
			if (d.Doping !== '') {
				return '#1f77b4';
			}
			return '#ff7f0e';
		})
		.on('mouseover', function (e) {
			let tooltip = select('#tooltip');
			tooltip
				.transition()
				.duration(200)
				.style('opacity', 1)
				.style('top', select(this).attr('cy') - 10 + 'px')
				.style('left', select(this).attr('cx') + 'px')
				.attr('data-year', select(this).attr('data-year'));

			let d = e.target.dataset;

			let name = d.name;
			let nationality = d.nationality;
			let year = d.year;
			let time = d.time;
			let doping = d.doping;

			tooltip.html(`<div>
			<p>${name}: ${nationality}</p>
			<p>Year: ${year}, Time: ${time}</p>
			<br>
			<p>${doping ? doping : 'No doping allegations on record'}</p></div>`);
		})
		.on('mouseout', function (e) {
			let tooltip = select('#tooltip');
			tooltip.transition().duration(200).style('opacity', 0);
		});
}
