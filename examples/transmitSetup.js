const express = require('express');
const app = express();
const util = require('util');
const {exec} = require('child_process');

var SX128x = require('../lib/sx128x');

/*****************************************************************
This example is to test the setup from SX Arduino Library found:
https://github.com/StuartsProjects/SX12XX-LoRa/blob/master/examples/SX128x_examples/Basics/4_LoRa_Receiver/4_LoRa_Receiver.ino
*****************************************************************/

var options = require('./options');

var radio = new SX128x(options);//spiBus: 0,spiDevice : 0

async function setup(){
    await radio.setStandby('STDBY_RC');
    await radio.setRegulatorMode(radio.USE_LDO);
    await radio.setPacketType(radio.PACKET_TYPE_LORA);
    await radio.setRFFreq(options.rfFreq);
    await radio.setBufferBaseAddr(options.txBaseAddr, options.rxBaseAddr);
    await radio.setModulationParams(options.modParams);
    await radio.setDioIrqParams(options.irqMask, options.dioMask);
    await radio.setHighSensitivity();
}


async function send(){
    await radio.open();
    await setup();
    await radio.checkDevice();
    await radio._checkBusy();
    let count = 0;

    await radio.printModemSettings();
    await radio.printOperatingSettings();

    while(true){
        //send a message every second.
        let sendMsg = ('hello ' + count++)
        try {
            await radio.send(sendMsg);
        } catch (err) {
            console.error(err);
        }
        let sendBuffer = Buffer.from(sendMsg);
        let rtnMsg = await radio.readBuffer(0x00, sendBuffer.length);
        radio._trace('rtnMsg: '+ rtnMsg);
        //console.log(rtnMsg);
        //console.log(sendBuffer);
        if(Buffer.compare(rtnMsg, sendBuffer)==0){
            //both vgTest1 and vgTest2 rigs are testing successfully here.
            radio._trace('tx written to buffer successfully.');
        }
        await util.promisify(setTimeout)(1000);
    }
}

send();
