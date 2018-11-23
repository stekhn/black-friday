const fs = require('fs');

const productValues = require('./data/product-prices.json');

let productPerc = productValues.map(d => {
  if (d.prices) {
    d.prices.sort((a, b) => new Date(b.x) - new Date(a.x));
    d.prices = percentageChange(d.prices, 'x', 'y');
    return d;
  }
}).filter(Boolean);

fs.writeFileSync('./data/product-percentages.json', JSON.stringify(productPerc), 'utf8');

function percentageChange(arr, dateKey, valueKey) {

  return arr.reduce((acc, curr) => {
    acc.diffs.push({
      date: new Date(curr[dateKey]),
      price: ((curr[valueKey] - acc.prev) / acc.prev) * 100
    });
    return acc;
  }, {
    prev: arr[arr.length - 1][valueKey],
    diffs: []
  }).diffs;
}
