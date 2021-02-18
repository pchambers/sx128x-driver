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

/*****************************************************************
This example is to test the setup from SX Arduino Library found:
https://github.com/StuartsProjects/SX12XX-LoRa/blob/master/examples/SX128x_examples/Basics/4_LoRa_Receiver/4_LoRa_Receiver.ino
*****************************************************************/

var radio = new SX128x(options);//spiBus: 0,spiDevice : 0

await radio.setStandby('STDBY_RC');
await radio.setRegulatorMode(options.regulatorMode);
await radio.setPacketType(options.packetType);
await radio.setRFFreq(options.rfFreq);
await radio.setBufferBaseAddr(options.txBaseAddr, options.rxBaseAddr);
await radio.setModulationParams(options.modParams);
await radio.setPacketParams(options.pktParams);
await radio.setDioIrqParams(options.irqMask, options.dioMask);
await radio.setHighSensitivity();
