const express = require('express');
const app = express();
const util = require('util');
const {exec} = require('child_process');

var SX128x = require('../lib/sx128x');

let options = {
    modParams : { modParam1: SX128x.LORA_SF_5, modParam2:SX128x.LORA_BW_1600, modParam3:SX128x.LORA_CR_4_5},
    pktParams : {pktParam1: SX128x.LORA_PBLE_12_SYMB, pktParam2:SX128x.EXPLICIT_HEADER, pktParam3:0xFF, pktParam4:SX128x.LORA_CRC_DISABLE, pktParam5:SX128x.LORA_IQ_STD, pktParam6:0x00, pktParam7:0x00},
    txParams : {power: 0x1F, rampTime:SX128x.RADIO_RAMP_40_US},
    irqMask : {irqMask:[0x00,0x00]},
    dioMask : {dio1Mask:[0x00,0x00], dio2Mask:[0x00,00], dio3Mask:[0x00,0x00]},
    spiBus : 0,
    spiDevice : 0,
    resetPin : 17,
    busyPin : 18,
    packetType : SX128x.PACKET_TYPE_LORA,
    regulatorMode : 0x01,
    ranging : false,
    status : 0,
    rfFreq : SX128x.FREQ_24GHZ,
    autoFS : false
}

process.on('SIGNINT', async function () {
    //close the devices
    try {
        await radio.close();
    } catch (err) {
        console.log(err);
        process.exit();
    }
});

var radio = new SX128x(options);


async function send(){
    await radio.open();
    await radio.checkDevice();
    await radio._checkBusy();
    let count = 0;
/* - Comment out radio already open;
    try{
        await radio.open();
    } catch(err){
        console.error(err);
    }
*/
    while(true){
        //send a message every second.
        try {
            await radio.send('hello ' + count++);
        } catch (err) {
            console.error(err);
        }
        let sendBuffer = Buffer.from('hello ' + count);
        let rtnMsg = await radio.readBuffer(0x00, sendBuffer.length);
        radio._trace('rtnMsg: '+ rtnMsg);
        console.log(rtnMsg);
        if(Buffer.compare(rtnMsg, sendBuffer)==0){
            radio._trace('tx written to buffer successfully.');
        }
        await util.promisify(setTimeout)(1000);
    }

}

send();
