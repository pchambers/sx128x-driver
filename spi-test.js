const util = require('util');
const events = require('events');
const spi = require('spi-device');
const onoff = require('onoff');

const SPI_OPTIONS = {
    mode: spi.MODE0,
    maxSpeedHz: 12E6
};

let busyGpio = new onoff.Gpio(18, 'in', 'rising');
let resetGpio = new onoff.Gpio(17, 'out');
let openSpi = async function (spiBus, spiDevice){
    return new Promise ((resolve, reject) => {
        let spiObj = spi.open(spiBus, spiDevice, SPI_OPTIONS, err =>{
            if (err) reject(err);
            resolve(spiObj);
        })
    });
}



var ourTestMessage = {
    sendBuffer : Buffer.concat([
        Buffer([0x1A, 0x00]),
        Buffer.from('This is our buffer')
    ])
};
ourTestMessage.byteLength = ourTestMessage.sendBuffer.length;
ourTestMessage.receiveBuffer = Buffer.alloc(ourTestMessage.byteLength);

 async function writeBuff(offset =0x00, data, spiDevice) {
    return new Promise ((resolve, reject) => spiDevice.transfer([ourTestMessage], (err, messages) =>{
        if (err) reject(err);
        resolve(messages[0])
    }));
};

var ourReceiveMessage = {
    sendBuffer : Buffer([0x1B, 0x00, 0x00]),
    byteLength : 3,
    receiveBuffer : Buffer.alloc(ourTestMessage.sendBuffer.length)
};
async function readBuff (offset, payloadLen, spiDevice) {
    return new Promise ((resolve, reject) => spiDevice.transfer([ourReceiveMessage], (err, messages) => {
        if (err) reject(err);
        resolve(messages[0]);
    }))
}
async function test(){
    let spiDevice = await openSpi(0,1);
    let writeReturn = await writeBuff(0x00, ourTestMessage, spiDevice);
    console.log('Received Write Buffer: ');
    console.log(writeReturn.sendBuffer);

    let readReturn = await readBuff(0x00,ourTestMessage.sendBuffer.length, spiDevice);
    console.log('Received Read Buffer: ');
    console.log(readReturn.receiveBuffer);
};
test();
