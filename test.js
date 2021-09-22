const vs = require('./src/apis/VSCodeExtensions');
const a = new vs();

a.search('node').then(r => console.log(r));