const express = require('express');
const app = express();
const util = require('util');
const {exec} = require('child_process');

var SX128x = require('../lib/sx128x');
const regMasks = require('../lib/regMasks');

let options = {
    modParams : { modParam1: SX128x.LORA_SF_5, modParam2:SX128x.LORA_BW_1600, modParam3:SX128x.LORA_CR_4_5},
    pktParams : {pktParam1: 0x08, pktParam2:0x00, pktParam3:0x0F, pktParam4:0x00, pktParam5:0x00, pktParam6:0x00, pktParam7:0x00},
    txParams : {power: 0x1F, rampTime:0xE0},
    irqMask : {irqMask:[0x40,0x23]},
    dioMask : {dio1Mask:[0x00,0x01], dio2Mask:[0x00,0x02], dio3Mask:[0x40,0x20]},
    spiBus : 0,
    spiDevice : 1,
    resetPin : 17,
    busyPin : 18,
    packetType : SX128x.PACKET_TYPE_LORA,
    regulatorMode : 0x01,
    ranging : false,
    status : 0,
    rfFreq : SX128x.FREQ_24GHZ,
    autoFS : false
}

var radio = new SX128x({});

async function receive(){
    radio.listen = true;
    try{
        await radio.open();
    } catch(err){
        console.error(err);
    }
    while(true){
        try{
            let msg = await radio.receive();
            let pktStatus = await radio.getPacketStatus();
            if (msg){
                console.log('Message: '+msg.toString('hex'));
                console.log(pktStatus);
                //console.log('msg keys: ' + Object.keys(msg));
            }
        }catch(err){
            console.error(err);
        }
        await util.promisify(setTimeout)(1000);
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
