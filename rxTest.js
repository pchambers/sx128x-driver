const express = require('express');
const app = express();
const util = require('util');
const {exec} = require('child_process');

var SX128x = require('../lib/sx128x');

var radio = new SX128x({spiDevice: 0, spiBus: 0});

console.log(await radio.open());
