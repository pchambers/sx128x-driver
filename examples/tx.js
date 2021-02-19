const express = require('express');
const app = express();
const util = require('util');
const {exec} = require('child_process');

var SX128x = require('../lib/sx128x');

var options = require('./options');

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

    while(true){
        //send a message every second.
        let sendMsg = ('hello ' + count++)
        let sendReceipt = await radio.send(sendMsg);
        //await radio.irqParse();
        console.log('Tx Done ' + radio.irqFlags.txDone );
        console.log('RxTx Timeout ' + radio.irqFlags.rxTxTimeout);
        let sendBuffer = Buffer.from(sendMsg);
        let rtnMsg = await radio.readBuffer(0x00, sendBuffer.length);
        radio._trace('rtnMsg: '+ rtnMsg);
        //console.log(rtnMsg);
        //console.log(sendBuffer);
        if(Buffer.compare(rtnMsg, sendBuffer)==0){
            //both vgTest1 and vgTest2 rigs are testing successfully here.
            radio._trace('tx written to buffer successfully.');
        }
        await util.promisify(setTimeout)(3000);
    }

}

send();
