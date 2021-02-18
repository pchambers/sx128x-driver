const express = require('express');
const app = express();
const util = require('util');
const {exec} = require('child_process');

var SX128x = require('../lib/sx128x');

var options = require('./options');

var radio = new SX128x(options);

async function setup(){
    await radio.setStandby('STDBY_RC');
    await radio.setRegulatorMode(options.regulatorMode);
    await radio.setPacketType(options.packetType);
    await radio.setRFFreq(options.rfFreq);
    await radio.setBufferBaseAddr(options.txBaseAddr, options.rxBaseAddr);
    await radio.setModulationParams(options.modParams);
    await radio.setPacketParams(options.pktParams);
    await radio.setDioIrqParams(options.irqMask, options.dioMask);
    await radio.setHighSensitivity();
}

async function receive(){
    radio.listen = true;
    try{
        await radio.open();
        await setup();
        await radio.checkDevice();
        await radio._checkBusy();
    } catch(err){
        console.error(err);
    }
    while(true){
        try{
            console.log('Waiting for Interrupt trigger.');
            let msg = await radio.receiveIntTrig();
            //let pktStatus = await radio.getPacketStatus();
            if (msg){
                console.log('Message: '+msg.toString('hex'));
                //console.log(pktStatus);
                //console.log('msg keys: ' + Object.keys(msg));
            }
        }catch(err){
            console.error(err);
        }
        await util.promisify(setTimeout)(10000);
    }
}
receive();

process.on('SIGNINT', async function () {
    //close the devices
    try {
        await radio.close();
    } catch (err) {
        console.log(err);
        process.exit();
    }
});
