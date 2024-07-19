const margin = { top: 20, right: 10, bottom: 50, left: 80 };
const graphWidth = 500 - margin.right - margin.left;
const graphHeight = 360 - margin.top - margin.bottom;

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', graphWidth + margin.left + margin.right)
  .attr('height', graphHeight + margin.top + margin.bottom);


const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const x = d3.scaleTime().range([0, graphWidth]);
const y = d3.scaleLinear().range([graphHeight, 0]);

const xAxisGroup = graph.append('g')
  .attr('class', 'x-axis')
  .attr('transform', "translate(0," + graphHeight + ")");

const yAxisGroup = graph.append('g')
  .attr('class', 'y-axis');

const line = d3.line()
  .curve(d3.curveCardinal)
  .x(function(d){ return x(new Date(d.date))})
  .y(function(d){ return y(d.weight)});

const path = graph.append('path');

const dottedLines = graph.append('g')
  .attr('class', 'lines')
  .style('opacity', 0);

const xDottedLine = dottedLines.append('line')
  .attr('stroke', '#aaa')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', 4);

const yDottedLine = dottedLines.append('line')
  .attr('stroke', '#aaa')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', 4);


const annotation = svg.append("text").attr("class","annotation")


const update = (data) => {

  // filter data based on current character
  data = data.filter(item => item.character == character);
  console.log('data', data)
  var weight_gain = data.length>0?data[data.length - 1].weight - data[0].weight:0
  console.log('weight_gain', weight_gain)

  data.length>0?graph.append("text")
  .attr("x", (graphWidth / 2))
  .attr("y", 0) 
  .attr("text-anchor", "middle")
  .attr("fill","#aaa")
  .style('font-weight','bold')
  .style('font-size','20')
  .text("The Weight Change"):null


  data.sort((a,b) => new Date(a.date) - new Date(b.date));

  x.domain(d3.extent([new Date('2023-01-01'),new Date('2024-12-31')]));
  y.domain([0, 240]);

  path.data([data])
    .attr('fill', 'none')
    .attr('stroke', '#aaa')
    .attr('stroke-width', '2')
    .attr('d', line);

  const circles = graph.selectAll('circle')
    .data(data);

  circles.exit().remove();


  circles.attr('r', '4')
    .attr('cx', d => x(new Date(d.date)))
    .attr('cy', d => y(d.weight));

  circles.enter()
    .append('circle')
      .attr('r', '4')
      .attr('cx', d => x(new Date(d.date)))
      .attr('cy', d => y(d.weight))
      .attr('fill', '#E3CB8F');


  graph.selectAll('circle')
    .on('mouseover', (d, i, n) => {
      d3.select(n[i])
        .transition().duration(100)
        .attr('r', 8)
        .attr('fill', '#fff');

      xDottedLine
        .attr('x1', x(new Date(d.date)))
        .attr('x2', x(new Date(d.date)))
        .attr('y1', graphHeight)
        .attr('y2', y(d.weight));

      yDottedLine
        .attr('x1', 0)
        .attr('x2', x(new Date(d.date)))
        .attr('y1', y(d.weight))
        .attr('y2', y(d.weight));

      dottedLines.style('opacity', 100);

      annotation
            .attr('x',x(new Date(d.date)))
            .attr('y',y(d.weight)+10)
            .attr('class','annotation')
            .classed("hidden",false);
        
      const lineHeight = 20
      const width = 100
      var annotationText = `${formatDate(d.date)}\n${d.weight} lb.\nhappiness level ${d.happinesslevel}`
      var lines = annotationText.split('\n');
      lines.forEach((line, i) => {
                annotation.append("tspan")
                    .attr('x',x(new Date(d.date)))
                    .attr("dy", i === 0 ? 0 : lineHeight)
                    .attr("text-anchor", "middle")
                    .text(line)});

        document.addEventListener('mousemove', function(e) {
                        const floatingBox = document.getElementById('floating-box');
                        const floatImage = floatingBox.querySelector('img')
                        const mouseX = e.clientX;
                        const mouseY = e.clientY;
                    
                        const offsetX = 20;
                        const offsetY = 20;
                        floatImage.src = d.img;
                        floatingBox.style.left = (mouseX + offsetX) + 'px';
                        floatingBox.style.top = (mouseY + offsetY) + 'px';
                        floatingBox.style.display = 'block'; // Make sure the box is visible
                    });    
    })

    .on('mouseleave', (d,i,n) => {
      d3.select(n[i])
        .transition().duration(100)
        .attr('r', 4)
        .attr('fill', '#E3CB8F');
      dottedLines.style('opacity', 0);
      
      annotation.classed("hidden",true);
      annotation.selectAll("tspan").remove()

      document.addEventListener('mousemove', function(e) {
        const floatingBox = document.getElementById('floating-box');
        const mouseX = e.clientX;
        const mouseY = e.clientY;
    
        const offsetX = 20;
        const offsetY = 20;
        floatingBox.style.left = (mouseX + offsetX) + 'px';
        floatingBox.style.top = (mouseY + offsetY) + 'px';
        floatingBox.style.display = null; // Make sure the box is visible

  
    });      
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
