const express = require('express');
const app = express();
const util = require('util');
const {exec} = require('child_process');

var SX128x = require('../lib/sx128x');

let options = {
    txBaseAddress: 0x00,
    rxBaseAddress: 0x00,
    modParams : { spreadingFactor: SX128x.LORA_SF_7, bandwidth:SX128x.LORA_BW_0400,codingRate:SX128x.LORA_CR_4_5},
    pktParams : {pktParam1: SX128x.LORA_PBLE_12_SYMB, pktParam2:SX128x.LORA_PKT_VARIABLE_LENGTH, pktParam3:0xFF, pktParam4:SX128x.LORA_CRC_ENABLE, pktParam5:SX128x.LORA_IQ_STD, pktParam6:0x00, pktParam7:0x00},
    txParams : {power: 0x1F, rampTime:SX128x.RADIO_RAMP_04_US},
    irqMask : {irqMask:SX128x.IRQ_RADIO_ALL},
    dioMask : {dio1Mask: (SX128x.IRQ_TX_DONE + SX128x.IRQ_RX_DONE + SX128x.IRQ_RX_TX_TIMEOUT), dio2Mask:0x0000, dio3Mask:0x0000},
    spiBus : 0,
    spiDevice : 0,
    dio1Pin : 16,
    resetPin : 17,
    busyPin : 18,
    packetType : SX128x.PACKET_TYPE_LORA,
    regulatorMode : SX128x.USE_LDO,
    ranging : false,
    status : 0,
    rfFreq : [0xBC, 0x19, 0x94], //this is 2445000000 Hz /198.34 PLL steps = 12327316
    autoFS : false
}

var radio = new SX128x(options);//spiBus: 0,spiDevice : 0
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
        await util.promisify(setTimeout)(60000);
    }
}
setup();
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
