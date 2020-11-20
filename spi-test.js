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
            resolve(spiOj);
        })
    });
}
let spiDevice = openSpi(0,1);

var ourTestMessage = {
    sendBuffer : Buffer.concat([
        Buffer([0x1A, 0x00]),
        Buffer.from('This is our buffer')
    ]),
    byteLength : sendBuffer.length,
    receiveBuffer : Buffer.alloc(byteLength)
};

 async function writeBuffer (offset =0x00, data) {
    return new Promise ((resolve, reject) => spiDevice.transfer([ourTestMessage], (err, messages) =>{
        if (err) reject(err);
        resolve(messages[0])
    }));
}


let writeReturn = await writeBuffer(0x00, ourTestMessage).sendBuffer;
console.log('Received Write Buffer: ');
console.log(writeReturn);

var ourReceiveMessage = {
    sendBuffer : Buffer([0x1B, 0x00, 0x00]),
    byteLength : 3,
    receiveBuffer : Buffer.alloc(ourTestMessage.sendBuffer.length)
};
async function readBuffer (offset, payloadLen) {
    return new Promise ((resolve, reject) => spiDevice.transfer([ourReceiveMessage], (err, messages) => {
        if (err) reject(err);
        resolve(messges[0]);
    }))
}

let readReturn = await readBuffer(0x00,ourTestMessage.sendBuffer.length).receiveBuffer;
console.log('Received Read Buffer: ');
console.log(readReturn);
