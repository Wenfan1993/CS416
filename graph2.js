
const svg2 = d3.select('.canvas2')
  .append('svg')
  .attr('width', graphWidth + margin.left + margin.right)
  .attr('height', graphHeight + margin.top + margin.bottom);

const graph2 = svg2.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const x2 = d3.scaleTime().range([0, graphWidth]);
const y2 = d3.scaleLinear().range([graphHeight, 0]);

const xAxisGroup2 = graph2.append('g')
  .attr('class', 'x-axis')
  .attr('transform', "translate(0," + graphHeight + ")");

const yAxisGroup2 = graph2.append('g')
  .attr('class', 'y-axis2');


const line2 = d3.line()
  .curve(d3.curveCardinal)
  .x(function(d){ return x2(new Date(d.date))})
  .y(function(d){ return y2(d.happinesslevel)});

const path2 = graph2.append('path');

const dottedLines2 = graph2.append('g')
  .attr('class', 'lines')
  .style('opacity', 0);

const xDottedLine2 = dottedLines2.append('line')
  .attr('stroke', '#aaa')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', 4);

const yDottedLine2 = dottedLines2.append('line')
  .attr('stroke', '#aaa')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', 4);

const annotation2 = svg2.append("text").attr("class","annotation")

const update2 = (data2) => {

  // filter data based on current character
  data2 = data2.filter(item => item.character == character);
  data2.sort((a,b) => new Date(a.date) - new Date(b.date));

  data2.length>0?graph2.append("text")
  .attr("x", (graphWidth / 2))
  .attr("y", 0) 
  .attr("text-anchor", "middle")
  .attr("fill","#aaa")
  .style('font-weight','bold')
  .style('font-size','20')  
  .text("The Happiness Level Change"):null

  x2.domain(d3.extent([new Date('2023-01-01'),new Date('2024-12-31')]));
  y2.domain([0, 7]);

  path2.data([data2])
    .attr('fill', 'none')
    .attr('stroke', '#aaa')
    .attr('stroke-width', '2')
    .attr('d', line2);

  const circles2 = graph2.selectAll('circle')
    .data(data2);

  circles2.exit().remove();

  circles2.attr('r', '4')
    .attr('cx', d => x2(new Date(d.date)))
    .attr('cy', d => y2(d.happinesslevel));


  circles2.enter()
    .append('circle')
      .attr('r', '4')
      .attr('cx', d => x2(new Date(d.date)))
      .attr('cy', d => y2(d.happinesslevel))
      .attr('fill', '#E3CB8F');

  graph2.selectAll('circle')
    .on('mouseover', (d, i, n) => {
      d3.select(n[i])
        .transition().duration(100)
        .attr('r', 8)
        .attr('fill', '#fff');

      xDottedLine2
        .attr('x1', x2(new Date(d.date)))
        .attr('x2', x2(new Date(d.date)))
        .attr('y1', graphHeight)
        .attr('y2', y2(d.happinesslevel));

      yDottedLine2
        .attr('x1', 0)
        .attr('x2', x2(new Date(d.date)))
        .attr('y1', y2(d.happinesslevel))
        .attr('y2', y2(d.happinesslevel));

      dottedLines2.style('opacity', 100);

      annotation2
            .attr('x',x2(new Date(d.date)))
            .attr('y',y2(d.happinesslevel))
            .attr('class','annotation')
            .classed("hidden",false);
        
      const lineHeight = 20
      var annotationText = `${formatDate(d.date)}\n${d.weight} lb.\nhappiness level ${d.happinesslevel}`
      var lines = annotationText.split('\n');
      lines.forEach((line, i) => {
        annotation2.append("tspan")
                    .attr('x',x2(new Date(d.date)))
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
        floatingBox.style.display = 'block'; 
    });
    })
    .on('mouseleave', (d,i,n) => {
      d3.select(n[i])
        .transition().duration(100)
        .attr('r', 4)
        .attr('fill', '#E3CB8F');

      dottedLines2.style('opacity', 0)
      annotation2.classed("hidden",true);
      annotation2.selectAll("tspan").remove()


      document.addEventListener('mousemove', function(e) {
        const floatingBox = document.getElementById('floating-box');
        const mouseX = e.clientX;
        const mouseY = e.clientY;
    

        const offsetX = 20;
        const offsetY = 20;
        floatingBox.style.left = (mouseX + offsetX) + 'px';
        floatingBox.style.top = (mouseY + offsetY) + 'px';
        floatingBox.style.display = null; 

    });
    });


  const xAxis2 = d3.axisBottom(x2)
    .ticks(12)
    .tickFormat(d3.timeFormat("%b %d %Y"));
    
  const yAxis2 = d3.axisLeft(y2)
    .ticks(7)
    .tickFormat(d => d<=5?d + ' level':'');


  xAxisGroup2.call(xAxis2);
  yAxisGroup2.call(yAxis2);

  xAxisGroup2.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end');

  var is_happier = data2.length>0?data2[data2.length - 1].happinesslevel > data2[0].happinesslevel:false
  return is_happier
};
