const fs = require('fs');
const request = require('request');
const async = require('async');

const products = require('./data/product-list.json');

async.eachLimit(products, 1, (product, callback) => {

  request('https://www.idealo.de/offerpage/pricechart/api/' + product.id + '?period=P3M',
    (error, response, body) => {

      if (!body) {

        console.error(error);
      } else {

        product.prices = JSON.parse(body).data;

        console.log(`Received ${product.prices.length} prices for ${product.name}`);
      }

      setTimeout(() => {
        callback();
      }, 500);
    }
  );
}, (error) => {

  if (error) { console.error(error); }

  fs.writeFileSync('./data/product-prices.json', JSON.stringify(products), 'utf8');

  console.log(`Downloaded prices for ${products.length} products`);
});
