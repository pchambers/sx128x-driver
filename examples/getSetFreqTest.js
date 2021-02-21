const express = require('express');
const app = express();
const util = require('util');
const {exec} = require('child_process');

var SX128x = require('../lib/sx128x');
var options = require('./options');

var radio = new SX128x(options);

async function getSetTest(){
    radio.listen = true;

    await radio.open();
    await radio.checkDevice();
    await radio._checkBusy();

    var input = [0xBC, 0x19, 0x94];
    console.log(input);
    await radio.setRFFreq(input);
    var returnFreq = await radio._getFreqInt();
    console.log(returnFreq);

};

getSetTest();

process.on('SIGNINT', async function () {
    //close the devices
    try {
        await radio.close();
    } catch (err) {
        console.log(err);
        process.exit();
    }
});
