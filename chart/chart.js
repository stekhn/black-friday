document.addEventListener('DOMContentLoaded', init, false);

var defaultHeight = 400;
var margin = { top: 10, right: 10, bottom: 30, left: 50 };
var tickCount = 5;
var tickSize = 6;
var tickPadding = 3;

var width, height, timeout, cachedData;

function init() {
  d3.json('data/product-percentages.json', function (data) {
    data.push({ key: 'average', prices: getAverage(data) });
    cachedData = data;
    draw(data);
  });

  window.addEventListener('resize', redraw, false);
}

function draw(data) {
  var container = d3.select('#chart');

  // Set initial dimensions
  width = container.node().getBoundingClientRect().width;
  height = defaultHeight;

  // Create canvas context
  var context = container
    .append('canvas')
    .attr('width', width)
    .attr('height', height)
    .node()
    .getContext('2d');

  // Set drawing dimensions
  width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

  var xMax = d3.max(data, function (d) {
    return d3.max(d.prices, function (c) {
      return new Date(c.date);
    });
  });

  var x = d3.scaleTime()
    .domain([new Date('2018-8-23'), xMax])
    .range([0, width]);

  var y = d3.scaleLinear()
    .domain([-25, 25])
    .range([height, 0]);

  var line = d3.line()
    .x(function (d) { return x(new Date(d.date)); })
    .y(function (d) { return y(d.price); })
    .curve(d3.curveMonotoneX)
    .context(context);

  // Set up the canvas
  context.translate(margin.left, margin.top);
  context.font = '14px Helvetica, Arial';

  // Draw lines
  data.forEach(function (d) {
    context.beginPath();
    line(d.prices);
    context.lineWidth = (d.key === 'average') ? 3 : 1.5;
    context.strokeStyle = (d.key == 'average') ? 'rgba(30,144,255,1)' : 'rgba(173,216,230,0.1)';
    context.stroke();
  });

  // Draw x axis
  context.beginPath();
  context.lineWidth = 1;
  x.ticks(tickCount).forEach(function (d) {
    context.moveTo(x(d), height);
    context.lineTo(x(d), height + tickSize);
  });
  context.strokeStyle = 'black';
  context.stroke();

  context.textAlign = 'center';
  context.textBaseline = 'top';
  x.ticks(tickCount).forEach(function (d) {
    context.fillText(x.tickFormat()(d), x(d), height + tickSize);
  });

  // Draw y axis
  context.beginPath();
  context.lineWidth = 1;
  y.ticks(tickCount).forEach(function (d) {
    context.moveTo(0, y(d));
    context.lineTo(-6, y(d));
  });
  context.strokeStyle = 'black';
  context.stroke();

  context.textAlign = 'right';
  context.textBaseline = 'middle';
  y.ticks(tickCount).forEach(function (d) {
    var tickValue = (d <= 0 ? '' : '+') + d + ' %';
    context.fillText(tickValue, -tickSize - tickPadding, y(d));
  });

  // Draw dot for last value
  var lastValue = data[data.length - 1].prices[0];
  var lastX = x(new Date(lastValue.date));
  var lastY = y(lastValue.price);

  context.beginPath();
  context.arc(lastX, lastY, 5, 0, 2 * Math.PI, false);
  context.fillStyle = 'rgba(30,144,255,1)';
  context.fill();

  context.font = 'bold 14px Helvetica, Arial';
  context.textAlign = 'right';
  context.textBaseline = 'middle';
  context.fillStyle = 'black';
  context.fillText(Math.round(lastValue.price) + ' %', lastX - 10, lastY);
}

function redraw() {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    d3.select('#chart').html('');
    draw(cachedData);
  }, 500);
}

function getAverage(data) {
  return data.reduce(function (acc, curr, i) {
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
