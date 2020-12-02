const express = require('express');
const app = express();
const util = require('util');
const {exec} = require('child_process');

const SX128x = require('../lib/sx128x');

var radio = new SX128x({spiDevice: 0, spiBus: 0});

let openReturn = await radio.open();
console.log(openReturn);
