
const svg2 = d3.select('#canvas2')
  .append('svg')
  .attr('width', graphWidth + margin.left + margin.right)
  .attr('height', graphHeight + margin.top + margin.bottom);

const graph2 = svg2.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// scales
const x2 = d3.scaleTime().range([0, graphWidth]);
const y2 = d3.scaleLinear().range([graphHeight, 0]);

// axes groups
const xAxisGroup2 = graph2.append('g')
  .attr('class', 'x-axis')
  .attr('transform', "translate(0," + graphHeight + ")");

const yAxisGroup2 = graph2.append('g')
  .attr('class', 'y-axis');

// d3 line path generator
const line2 = d3.line()
  .curve(d3.curveCardinal)
  .x(function(d){ return x(new Date(d.date))})
  .y(function(d){ return y(d.weight)});

// line path element
const path2 = graph2.append('path');

// create dotted line group and append to graph
const dottedLines2 = graph2.append('g')
  .attr('class', 'lines')
  .style('opacity', 0);

// create x dotted line and append to dotted line group
const xDottedLine2 = dottedLines2.append('line')
  .attr('stroke', '#aaa')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', 4);

// create y dotted line and append to dotted line group
const yDottedLine2 = dottedLines2.append('line')
  .attr('stroke', '#aaa')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', 4);

// update function
const update2 = (data2) => {

  // filter data based on current character
  data2 = data2.filter(item => item.character == character);
  console.log('data2', data2)
  var weight_gain2 = data2.length>0?data2[data2.length - 1].weight - data2[0].weight:0
  console.log('weight_gain2', weight_gain2)

  // sort the data based on date objects
  data2.sort((a,b) => new Date(a.date) - new Date(b.date));
//   var max_weight = data? data[data.length - 1].weight - data[0].weight:0

  // set scale domains
  x2.domain(d3.extent(data2, d => new Date(d.date)));
  y2.domain([5, 200]);

  // update path data
  path2.data([data2])
    .attr('fill', 'none')
    .attr('stroke', '#aaa')
    .attr('stroke-width', '2')
    .attr('d', line2);

  // create circles for points
  const circles2 = graph2.selectAll('circle')
    .data(data2);

  // remove unwanted points
  circles2.exit().remove();

  // update current points
  circles2.attr('r', '4')
    .attr('cx', d => x(new Date(d.date)))
    .attr('cy', d => y(d.weight));

  // add new points
  circles2.enter()
    .append('circle')
      .attr('r', '4')
      .attr('cx', d => x(new Date(d.date)))
      .attr('cy', d => y(d.weight))
      .attr('fill', '#E3CB8F');

  // add event listeners to circle (and show dotted lines)
  graph2.selectAll('circle')
    .on('mouseover', (d, i, n) => {
      d3.select(n[i])
        .transition().duration(100)
        .attr('r', 8)
        .attr('fill', '#fff');
      // set x dotted line coords (x1,x2,y1,y2)
      xDottedLine2
        .attr('x1', x(new Date(d.date)))
        .attr('x2', x(new Date(d.date)))
        .attr('y1', graphHeight)
        .attr('y2', y(d.weight));
      // set y dotted line coords (x1,x2,y1,y2)
      yDottedLine2
        .attr('x1', 0)
        .attr('x2', x(new Date(d.date)))
        .attr('y1', y(d.weight))
        .attr('y2', y(d.weight));
      // show the dotted line group (opacity)
      dottedLines2.style('opacity', 100);
    })
    .on('mouseleave', (d,i,n) => {
      d3.select(n[i])
        .transition().duration(100)
        .attr('r', 4)
        .attr('fill', '#E3CB8F');
      // hide the dotted line group (opacity)
      dottedLines2.style('opacity', 0)
    });

  // create axes
  const xAxis2 = d3.axisBottom(x)
    .ticks(12)
    .tickFormat(d3.timeFormat("%b %d %Y"));
    
  const yAxis2 = d3.axisLeft(y)
    .ticks(4)
    .tickFormat(d => d + 'lb');

  // call axes
  xAxisGroup2.call(xAxis2);
  yAxisGroup2.call(yAxis2);

  // rotate axis text
  xAxisGroup2.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end');

  return weight_gain2

};

// data and firestore
var data2 = [
    {
        date : new Date("2023-07-01"),
        weight: 105,
        character: 'Wendy'
    },
    {
        date : new Date("2023-09-06"),
        weight: 110,
        character: 'Wendy'
    },
    {
        date : new Date("2023-12-12"),
        weight: 115,
        character: 'Wendy'
    },
    {
        date : new Date("2024-02-05"),
        weight: 120,
        character: 'Wendy'
    },
    {
        date : new Date("2024-05-25"),
        weight: 110,
        character: 'Wendy'
    },
    {
        date : new Date("2023-07-01"),
        weight: 178,
        character: 'Yudu'
    },
    {
        date : new Date("2023-09-06"),
        weight: 180,
        character: 'Yudu'
    },
    {
        date : new Date("2023-12-12"),
        weight: 190,
        character: 'Yudu'
    },
    {
        date : new Date("2024-02-05"),
        weight: 180,
        character: 'Yudu'
    },
    {
        date : new Date("2024-05-25"),
        weight: 175,
        character: 'Yudu'
    },    
    {
        date : new Date("2023-07-01"),
        weight: 10,
        character: 'Potato'
    },
    {
        date : new Date("2023-09-06"),
        weight: 10,
        character: 'Potato'
    },
    {
        date : new Date("2023-12-12"),
        weight: 10,
        character: 'Potato'
    },
    {
        date : new Date("2024-02-05"),
        weight: 10,
        character: 'Potato'
    },
    {
        date : new Date("2024-05-25"),
        weight: 10,
        character: 'Potato'
    },        
];

update2(data2);