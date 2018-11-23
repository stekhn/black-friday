# Are Black Friday deals worth it?

No, Black Friday deals are trying to get you to buy something you probably don't need and never intended to buy in the first place. On the other hand, you might save about 12% on average.  

The analysis was done in my lunch break and compares the cheapest available prices for 787 items on the German price comparison website [Idealo.de](https://www.idealo.de/). Therefore, all statements and interpretations can only be applied to the German online retail market.

This analysis is derived from my analysis of the impact of the cryptocurrency hype on the price of graphics cards: [The GPU Price Surge](https://github.com/stekhn/gpu-price-surge-analysis)

### Usage

1. Clone repository `git clone https://...`
2. Install dependencies `npm install`
3. Start a local web server `npm start`

### Data
The data was scraped from the Idealo, a German price comparison website. The list of items was compiles from Idealo's Black Friday list.

You can see the full list of products here: [data/product-list.json](https://github.com/stekhn/black-friday/blob/master/data/product-list.json)

### Scraping

Idealo provides an API endpoint for price history (which they use to render nice price chart on their website): `https://www.idealo.de/offerpage/pricechart/api/PRODUCTID?period=P3M`

I'm using the product IDs from the product list to make some request to API and fetch the data for the last 3 month.

```
$ node getPriceHistory.js
```

When everything goes well, the data is saved in [data/product-prices.json](https://github.com/stekhn/black-friday/blob/master/data/product-prices.json).

By changing parameters in the request URL, it's possible to get a price history for up to one year: `?period=P1Y` 

### Analysis

The create a common baseline for plotting the data, it makes sense to calculate the percental change from the initial price (relative value), instead of the using the real price (absolute value).

```
$ node calculatePercentages.js
```

The percentages get saved in [data/product-percentages.json](https://github.com/stekhn/black-friday/blob/master/data/product-prices.json).

### Chart

The chart was build with [D3.js](https://d3js.org/) and is still very ”beta”. Drawing a few hundred lines is something that should be done with Canvas or WebGL – not SVG. At the moment, the performance is very laggy.

### ToDo
- Add interpretation of the results
- Use Canvas to draw the chart
- Do the dishes
