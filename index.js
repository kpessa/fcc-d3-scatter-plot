import { select, selectAll, scaleLinear, scaleTime, extent, axisLeft, axisBottom, timeParse, timeFormat } from 'd3';
import d3 from 'd3';
import { chartSetup, addAxes, plotData } from './chartSetup';

const { margin, svg, graph, chart, width, height } = chartSetup();

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
	.then(response => response.json())
	.then(data => {
		console.log(data);
		const { xScale, yScale, parseTimeYear, parseTimeTime } = addAxes(chart, data, width, height);
		graph.call(plotData, data, xScale, yScale, parseTimeYear, parseTimeTime);
	})
	.catch(error => console.log(error));
