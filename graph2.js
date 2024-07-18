
const svg2 = d3.select('.canvas2')
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
  .attr('class', 'y-axis2');

// d3 line path generator
const line2 = d3.line()
  .curve(d3.curveCardinal)
  .x(function(d){ return x2(new Date(d.date))})
  .y(function(d){ return y2(d.happinesslevel)});

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
  // sort the data based on date objects
  data2.sort((a,b) => new Date(a.date) - new Date(b.date));

  // set scale domains
  x2.domain(d3.extent(data2, d => new Date(d.date)));
  y2.domain([0, 5]);

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
    .attr('cx', d => x2(new Date(d.date)))
    .attr('cy', d => y2(d.happinesslevel));

  // add new points
  circles2.enter()
    .append('circle')
      .attr('r', '4')
      .attr('cx', d => x2(new Date(d.date)))
      .attr('cy', d => y2(d.happinesslevel))
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
        .attr('x1', x2(new Date(d.date)))
        .attr('x2', x2(new Date(d.date)))
        .attr('y1', graphHeight)
        .attr('y2', y2(d.happinesslevel));
      // set y dotted line coords (x1,x2,y1,y2)
      yDottedLine2
        .attr('x1', 0)
        .attr('x2', x2(new Date(d.date)))
        .attr('y1', y2(d.happinesslevel))
        .attr('y2', y2(d.happinesslevel));
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
  const xAxis2 = d3.axisBottom(x2)
    .ticks(12)
    .tickFormat(d3.timeFormat("%b %d %Y"));
    
  const yAxis2 = d3.axisLeft(y2)
    .ticks(4)
    .tickFormat(d => d + ' level');

  // call axes
  xAxisGroup2.call(xAxis2);
  yAxisGroup2.call(yAxis2);

  // rotate axis text
  xAxisGroup2.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end');
};