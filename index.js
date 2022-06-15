import { select, selectAll, scaleLinear, scaleTime, extent, axisLeft, axisBottom, timeParse, timeFormat } from 'd3';
import d3 from 'd3';
import { chartSetup, addAxes } from './chartSetup';
const { margin, svg, chart, width, height } = chartSetup();

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
	.then(response => response.json())
	.then(data => {
		console.log(data);
		const { xScale, yScale, parseTimeYear, parseTimeTime } = addAxes(chart, data, width, height);

		const graph = chart.append('g').attr('id', 'graph');

		graph.append('circle').attr('cx', 50).attr('cy', 50).attr('r', 10).attr('fill', 'red');

		graph
			.selectAll('circle')
			.data(data)
			.join('circle')
			.attr('cx', d => xScale(parseTimeYear(d.Year)))
			.attr('cy', d => yScale(parseTimeTime(d.Time)))
			.attr('r', 5)
			.attr('stroke', 'black')
			.attr('fill', d => {
				if (d.Doping !== '') {
					return '#1f77b4';
				}
				return '#ff7f0e';
			});
	})
	.catch(error => console.log(error));
