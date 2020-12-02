const SX128x = require('../lib/sx128x');

var radio = new SX128x({spiBus: 0,spiDevice : 0});

let openReturn = await radio.open();
console.log(openReturn);
