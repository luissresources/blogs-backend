const _ = require('lodash')

const data = ["apple", "banana", "apple", "orange", "grapes", "mango", "banana"];

const result = _.values(_.groupBy(data)).map(d => ({name: d[0], count: d.length}));

console.log(result);