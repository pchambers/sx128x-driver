const express = require('express');
const app = express();
const util = require('util');
const {exec} = require('child_process');

var SX128x = require('../lib/sx128x');
const regMasks = require('../lib/regMasks');

let options = {
    modParams : { modParam1: regMasks.LORA_SF_7, modParam2:regMasks.LORA_BW_400, modParam3:regMasks.LORA_CR_4_5},
    pktParams : {pktParam1: 0x08, pktParam2:0x00, pktParam3:0x0F, pktParam4:0x00, pktParam5:0x00, pktParam6:0x00, pktParam7:0x00},
    txParams : {power: 0x1F, rampTime:0xE0},
    irqMask : {irqMask:[0x40,0x23]},
    dioMask : {dio1Mask:[0x00,0x01], dio2Mask:[0x00,0x02], dio3Mask:[0x40,0x20]},
    spiBus : 0,
    spiDevice : 1,
    resetPin : 17,
    busyPin : 18,
    packetType : regMasks.PACKET_TYPE_LORA,
    regulatorMode : 0x01,
    ranging : false,
    status : 0,
    rfFreq : regMasks.FREQ_24GHZ,
    autoFS : false
}

var radio = new SX128x({options});

async function send(){
    let count = 0;

    try{
        await radio.open();
    } catch(err){
        //console.log('Error initializing radio ' + err);
        console.error(err);
    }
    //while(true){
    finally{
        //send a message every second.
        try {
            console.log('trying to send message');
            await radio.send('hello world ' + count++);
            console.log('successfully sent');
        } catch (err) {
            console.log(err);
        }
        await util.promisify(setTimeout)(1000);
    }

}
send();

process.on('SIGNINT', async function () {
    //close the devices
    try {
        await radio.close();
    } catch (err) {
        console.log(err);
        process.exit();
    }
});
