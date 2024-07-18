const margin = { top: 20, right: 20, bottom: 50, left: 80 };
const graphWidth = 500 - margin.right - margin.left;
const graphHeight = 360 - margin.top - margin.bottom;

const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', graphWidth + margin.left + margin.right)
  .attr('height', graphHeight + margin.top + margin.bottom);

const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// scales
const x = d3.scaleTime().range([0, graphWidth]);
const y = d3.scaleLinear().range([graphHeight, 0]);

// axes groups
const xAxisGroup = graph.append('g')
  .attr('class', 'x-axis')
  .attr('transform', "translate(0," + graphHeight + ")");

const yAxisGroup = graph.append('g')
  .attr('class', 'y-axis');

// d3 line path generator
const line = d3.line()
  .curve(d3.curveCardinal)
  .x(function(d){ return x(new Date(d.date))})
  .y(function(d){ return y(d.weight)});

// line path element
const path = graph.append('path');

// create dotted line group and append to graph
const dottedLines = graph.append('g')
  .attr('class', 'lines')
  .style('opacity', 0);

// create x dotted line and append to dotted line group
const xDottedLine = dottedLines.append('line')
  .attr('stroke', '#aaa')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', 4);

// create y dotted line and append to dotted line group
const yDottedLine = dottedLines.append('line')
  .attr('stroke', '#aaa')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', 4);


const annotation = svg.append("text").attr("class","annotation hidden")

// update function
const update = (data) => {

  annotation.classed("hidden",true);

  // filter data based on current character
  data = data.filter(item => item.character == character);
  console.log('data', data)
  var weight_gain = data.length>0?data[data.length - 1].weight - data[0].weight:0
  console.log('weight_gain', weight_gain)

  // sort the data based on date objects
  data.sort((a,b) => new Date(a.date) - new Date(b.date));
//   var max_weight = data? data[data.length - 1].weight - data[0].weight:0

  // set scale domains
  x.domain(d3.extent(data, d => new Date(d.date)));
  y.domain([5, 200]);

  // update path data
  path.data([data])
    .attr('fill', 'none')
    .attr('stroke', '#00bfa5')
    .attr('stroke-width', '2')
    .attr('d', line);

  // create circles for points
  const circles = graph.selectAll('circle')
    .data(data);

  // remove unwanted points
  circles.exit().remove();

  // update current points
  circles.attr('r', '4')
    .attr('cx', d => x(new Date(d.date)))
    .attr('cy', d => y(d.weight));

  // add new points
  circles.enter()
    .append('circle')
      .attr('r', '4')
      .attr('cx', d => x(new Date(d.date)))
      .attr('cy', d => y(d.weight))
      .attr('fill', '#E3CB8F');

  // add event listeners to circle (and show dotted lines)
  graph.selectAll('circle')
    .on('mouseover', (d, i, n) => {
      d3.select(n[i])
        .transition().duration(100)
        .attr('r', 8)
        .attr('fill', '#fff');
      // set x dotted line coords (x1,x2,y1,y2)
      xDottedLine
        .attr('x1', x(new Date(d.date)))
        .attr('x2', x(new Date(d.date)))
        .attr('y1', graphHeight)
        .attr('y2', y(d.weight));
      // set y dotted line coords (x1,x2,y1,y2)
      yDottedLine
        .attr('x1', 0)
        .attr('x2', x(new Date(d.date)))
        .attr('y1', y(d.weight))
        .attr('y2', y(d.weight));
      // show the dotted line group (opacity)
      dottedLines.style('opacity', 100);

      annotation
      .attr('x',x(new Date(d.date)))
      .attr('y',y(d.weight))
      .classed("hidden",false);

      annotation.select("img").attr("src",'img1.PNG')

      annotation.text('this is test')

    })
    .on('mouseleave', (d,i,n) => {
      d3.select(n[i])
        .transition().duration(100)
        .attr('r', 4)
        .attr('fill', '#E3CB8F');
      // hide the dotted line group (opacity)
      dottedLines.style('opacity', 0);
      
      annotation.classed("hidden",true);

    });

  // create axes
  const xAxis = d3.axisBottom(x)
    .ticks(12)
    .tickFormat(d3.timeFormat("%b %d %Y"));
    
  const yAxis = d3.axisLeft(y)
    .ticks(4)
    .tickFormat(d => d + 'lb');

  // call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  // rotate axis text
  xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end');

  return weight_gain

};

// data and firestore
var data = [
    {
        date : new Date("2023-07-01"),
        weight: 105,
        character: 'Wendy',
        happinesslevel:1
    },
    {
        date : new Date("2023-09-06"),
        weight: 110,
        character: 'Wendy',
        happinesslevel:1

    },
    {
        date : new Date("2023-12-12"),
        weight: 115,
        character: 'Wendy',
        happinesslevel:3
    },
    {
        date : new Date("2024-02-05"),
        weight: 120,
        character: 'Wendy',
        happinesslevel:4
    },
    {
        date : new Date("2024-05-25"),
        weight: 110,
        character: 'Wendy',
        happinesslevel:5
    },
    {
        date : new Date("2023-07-01"),
        weight: 178,
        character: 'Yudu',
        happinesslevel:1
    },
    {
        date : new Date("2023-09-06"),
        weight: 180,
        character: 'Yudu',
        happinesslevel:2
    },
    {
        date : new Date("2023-12-12"),
        weight: 190,
        character: 'Yudu',
        happinesslevel:1
    },
    {
        date : new Date("2024-02-05"),
        weight: 180,
        character: 'Yudu',
        happinesslevel:3
    },
    {
        date : new Date("2024-05-25"),
        weight: 175,
        character: 'Yudu',
        happinesslevel:4
    },    
    {
        date : new Date("2023-07-01"),
        weight: 10,
        character: 'Potato',
        happinesslevel:1
    },
    {
        date : new Date("2023-09-06"),
        weight: 10,
        character: 'Potato',
        happinesslevel:1
    },
    {
        date : new Date("2023-12-12"),
        weight: 10,
        character: 'Potato',
        happinesslevel:1
    },
    {
        date : new Date("2024-02-05"),
        weight: 10,
        character: 'Potato',
        happinesslevel:1
    },
    {
        date : new Date("2024-05-25"),
        weight: 10,
        character: 'Potato',
        happinesslevel:1
    },        
];
