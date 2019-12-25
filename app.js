window.addEventListener('DOMContentLoaded', () => {
  let svgWidth = 600
  let svgHeight = 600
  let barPadding = 1
  let padding = 40
  let initialBinsCount = 16
  
  let data = regionData.filter(d => d.medianAge !== null)
  
  /* Set svg dimensions */
  d3.select('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
  
  /* Add x-axis group */
  d3.select('svg')
    .append('g')
      .classed('xAxis', true)
    .attr('transform', `translate(0, ${svgHeight - padding})`)
  
  /* Add y-axis group */
  d3.select('svg')
    .append('g')
      .classed('yAxis', true)
    .attr('transform', `translate(${padding}, 0)`)
  
   /* Label for x-axis */
   d3.select('svg')
      .append('text')
        .attr('x', svgWidth / 2)
        .attr('y', svgHeight - padding)
        .attr('dy', padding - 5)
        .text('Median Age')
        .style('text-anchor', 'middle')
  
  /* Label for y-axis */
  d3.select('svg')
      .append('text')
        .attr('x', -svgHeight / 2)
        .attr('y', padding + 10)
        .attr('dy', -padding + 5)
        .text('Frequency')
        .attr('transform', 'rotate(-90)')
        .style('text-anchor', 'middle')
  
  /* Slider Input */
  d3.select('input')
    .property('min', 1)
    .property('max', 50)
    .property('value', initialBinsCount)
    .on('input', () => displayHistogram(+d3.event.target.value))
  
  displayHistogram(initialBinsCount)
  
  function displayHistogram(val) {
    /* x-scale */
    let xScale = d3.scaleLinear()
                    .domain(d3.extent(data, d => d.medianAge))
                    .rangeRound([padding, svgWidth - padding])
  
    /* Histogram Generator */
    let histogram = d3.histogram()
                      .domain(xScale.domain())
                      .thresholds(xScale.ticks(val))
                      .value(d => d.medianAge)  
  
    /* Histogram Bins */
    let bins = histogram(data)
  
    /* y-scale */
    let yScale = d3.scaleLinear()
                    .domain([0, d3.max(bins, d => d.length)])
                    .range([svgHeight - padding, padding])
  
    /* Axes */
    let yAxis = d3.axisLeft(yScale)
    let xAxis = d3.axisBottom(xScale)
                  .ticks(val)
  
    /* Display y-axis */
    d3.select('.yAxis')
      .call(yAxis)
  
    /* Display x-axis */
    d3.select('.xAxis')
        .call(xAxis)
      .selectAll('text')
        .attr('transform', 'rotate(90)')
        .attr('x', 15)
        .attr('y', -3)
        .style('text-anchor', 'middle')
  
    /* Display Bins Count */
    d3.select('#binsCount')
      .text(`Number of bins: ${bins.length}`)
  
    /* Display Histogram Bars */
    let bars = d3.select('svg')
                  .selectAll('.bar')
                  .data(bins)
  
    bars
      .exit()
      .remove()
  
    bars
      .enter()
      .append('rect')
        .classed('bar', true)
      .merge(bars)
        .attr('x', d => xScale(d.x0))
        .attr('y', d => yScale(d.length))
        .attr('width', d => xScale(d.x1) - xScale(d.x0) - barPadding)
        .attr('height', d => svgHeight - padding - yScale(d.length))
        .attr('fill', 'blue')
  }
})
