document.addEventListener('DOMContentLoaded', init, false);

var width = 800;
var height = 400;

var margin = { top: 10, right: 50, bottom: 30, left: 50 };

var timeout;
var productData;

function init() {

  var chart = drawChart();

  d3.json('data/product-percentages.json', function (data) {

    data.push({ key: 'average', prices: getAverage(data) });
    productData = data;

    drawProducts(data, chart);
  });

  window.addEventListener('resize', redraw, false);
}

function drawProducts(data, chart) {

  var current = {};

  current.data = data || productData;
  current.text = 'GPUs';
  current.color = 'dodgerblue';
  current.drawAxis = true;
  current.chart = chart;
  current.scale = drawAxis(current);
  current.lines = drawLines(current);
}

function drawChart() {

  var container = d3.select('#chart');

  width = container.node().getBoundingClientRect().width;

  var svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 ' + width + ' ' + height);

  var chart = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  return chart;
}

function drawAxis(current) {

  var xMax = d3.max(current.data, function (d) {
    return d3.max(d.prices, function (c) {
      return new Date(c.date);
    });
  });

  var xScale = d3.scaleTime()
    .domain([new Date('2018-8-23'), xMax])
    .range([0, width - margin.left - margin.right]);

  var yScale = d3.scaleLinear()
    .domain([-25, 25])
    .range([height - margin.top - margin.bottom, 0]);

  if (current.drawAxis) {

    current.chart.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + (height - margin.top - margin.bottom) + ')')
      .call(d3.axisBottom(xScale).ticks(5));

    current.chart.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(function (d) {
        return (d <= 0 ? '' : '+') + d + ' %';
      }));
  }

  return {
    x: xScale,
    y: yScale
  };
}

function drawLines(current) {

  var line = d3.line()
    .x(function (d) {
      return current.scale.x(new Date(d.date));
    })
    .y(function (d) {
      return current.scale.y(d.price);
    })
    .curve(d3.curveMonotoneX);

  var lines = current.chart.append('g')
    .attr('class', 'lines ' + current.text.toLowerCase())
    .selectAll('.line')
    .data(current.data)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', function (d) {
      return d.key == 'average' ? 'dodgerblue' : 'lightblue';
    })
    .attr('stroke-width', function (d) {
      return d.key == 'average' ? 3 : 1.5;
    })
    .attr('stroke-opacity', function (d) {
      return d.key == 'average' ? 1 : 0.1;
    })
    .attr('d', function (d) { return line(d.prices); });

  return lines;
}

function redraw () {

  clearTimeout(timeout);

  timeout = setTimeout(function () {

    d3.select('#chart').html('');

    var chart = drawChart();

    drawProducts(undefined, chart);
  }, 500);
}

function getAverage(data) {

  return data.reduce((acc, curr, i) => {
    if (curr) {
      curr.prices.forEach(function (d) {
        var pos = acc.map(obj => obj.date).indexOf(d.date);
        pos > -1 ?
          acc[pos].price = acc[pos].price + d.price / (i + 1) - acc[pos].price / (i + 1) :
          acc.push({ date: d.date, price: d.price });
      });
    }

    return acc;
  }, []);
}
