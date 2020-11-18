let util = require('util');
let events = require('events');

let onoff = require('onoff');
let spi = require('spi-device');

let SPI_OPTIONS = {
  mode: spi.MODE0,
  maxSpeedHz: 12E6
};

let NOP                            = 0x00;
//Register Functions:
SX128x.GET_STATUS                  = 0xC0;
SX128x.WRITE_REGISTER              = 0x18;
SX128x.READ_REGISTER               = 0x19;
SX128x.WRITE_BUFFER                = 0x1A;
SX128x.READ_BUFFER                 = 0x1B;
SX128x.SET_SLEEP                   = 0x84;
SX128x.SET_STANDBY                 = 0x80;
SX128x.SET_FS                      = 0xC1;
SX128x.SET_TX                      = 0x83;
SX128x.SET_RX                      = 0x82;
SX128x.SET_RX_DUTY_CYCLE           = 0x94;
SX128x.SET_CAD                     = 0xC5;
SX128x.SET_TX_CONTINUOUS_WAVE      = 0xD1;
SX128x.SET_TX_CONTINUOUS_PREAMBLE  = 0xD2;
SX128x.SET_PACKET_TYPE             = 0x8A;
SX128x.GET_PACKET_TYPE             = 0x03;
SX128x.SET_RF_FREQUENCY            = 0x86;
SX128x.SET_TX_PARAMS               = 0x8E;
SX128x.SET_CAD_PARAMS              = 0x88;
SX128x.SET_BUFFER_BASE_ADDRESS     = 0x8F;
SX128x.SET_MODULATION_PARAMS       = 0x8B;
SX128x.SET_PACKET_PARAMS           = 0xBC;
SX128x.GET_RX_BUFFER_STATUS        = 0x17;
SX128x.GET_PACKET_STATUS           = 0x1D;
SX128x.GET_RSSI_INST               = 0x1F;
SX128x.SET_DIO_IRQ_PARAMS          = 0x8D;
SX128x.GET_IRQ_STATUS              = 0x15;
SX128x.CLR_IRQ_STATUS              = 0x97;
SX128x.SET_REGULATOR_MODE          = 0x96;
SX128x.SET_SAVE_CONTEXT            = 0xD5;
SX128x.SET_AUTO_FS                 = 0x9E;
SX128x.SET_AUTO_TX                 = 0x98;
SX128x.SET_PERF_COUNTER_MODE       = 0x9C;
SX128x.SET_LONG_PREAMBLE           = 0x9B;
SX128x.SET_UART_SPEED              = 0x9D;
SX128x.SET_RANGING_ROLE            = 0xA3;
SX128x.SET_ADVANCED_RANGING        = 0x9A;

//Packet Types:
SX128x.PACKET_TYPE_GFSK            = 0x00;
SX128x.PACKET_TYPE_LORA            = 0x01;
SX128x.PACKET_TYPE_RANGING         = 0x02;
SX128x.PACKET_TYPE_FLRC            = 0x03;
SX128x.PACKET_TYPE_BLE             = 0x04;

//Frequency Selection:
SX128x.FREQ_24GHZ                  = [0xB8,0x9D,0x88];
SX128x.FREQ_RANGING                = [0xB8,0x9D,0x80];

//Modulation Params:
//modParam1 - Spreading Factor:
SX128x.LORA_SF_5                   = 0x50;
SX128x.LORA_SF_6                   = 0x60;
SX128x.LORA_SF_7                   = 0x70;
SX128x.LORA_SF_8                   = 0x80;
SX128x.LORA_SF_9                   = 0x90;
SX128x.LORA_SF_10                  = 0xA0;
SX128x.LORA_SF_11                  = 0xB0;
SX128x.LORA_SF_12                  = 0xC0;

//modParam2 - Bandwidth:
SX128x.LORA_BW_1600                = 0x0A;     //1625.0   kHz
SX128x.LORA_BW_800                 = 0x18;     // 812.5   kHz
SX128x.LORA_BW_400                 = 0x26;     // 406.25  kHz
SX128x.LORA_BW_200                 = 0x34;     // 203.125 kHz

//modParam 3 - Coding Rate:
SX128x.LORA_CR_4_5                 = 0x01;     // 4/5
SX128x.LORA_CR_4_6                 = 0x02;     // 4/6
SX128x.LORA_CR_4_7                 = 0x03;     // 4/7
SX128x.LORA_CR_4_8                 = 0x04;     // 4/8
SX128x.LORA_CR_LI_4_5              = 0x05;     // 4/5
SX128x.LORA_CR_LI_4_6              = 0x06;     // 4/6
SX128x.LORA_CR_LI_4_7              = 0x07;     // 4/8s
// --End Modulation Params. --

//Ranging:
SX128x.RANGING_SLAVE               = 0x00;
SX128x.RANGING_MASTER              = 0x01;

//Radio Ramping:
SX128x.RADIO_RAMP_02_US            = 0x00;     //2 us
SX128x.RADIO_RAMP_04_US            = 0x20;     //4 us
SX128x.RADIO_RAMP_06_US            = 0x40;     //6 us
SX128x.RADIO_RAMP_08_US            = 0x60;     //8 us
SX128x.RADIO_RAMP_10_US            = 0x80;     //10 us
SX128x.RADIO_RAMP_12_US            = 0xA0;     //12 us
SX128x.RADIO_RAMP_16_US            = 0xC0;     //16 us
SX128x.RADIO_RAMP_20_US            = 0xE0;     //20 us

//LoRa Channel Activity Detected Symbol Number Definitions
SX128x.LORA_CAD_01_SYMBOL          = 0x00;     //1 Symbol
SX128x.LORA_CAD_02_SYMBOLS         = 0x20;     //2 Symbols
SX128x.LORA_CAD_04_SYMBOLS         = 0x40;     //4 Symbols
SX128x.LORA_CAD_08_SYMBOLS         = 0x60;     //8 Symbols
SX128x.LORA_CAD_16_SYMBOLS         = 0x80;     //16 Symbols


SX128x.prototype._trace = function(message) {
    if (this._debug == true) {
        console.log('\x1b[36m%s\x1b[0m','Debug sx128x: ' + message);
    }
};
function SX128x (options) {
    this._BigBuffer = Buffer.alloc(257);
    this._status = Buffer.alloc(1);
    this._BUFFER = Buffer.alloc(10);
    this._mode_mask = 0xE0;
    this._cmd_stat_mask = 0x1C;
    this._status_msg = {mode:'',cmd:'',busy: false};
    this._status_mode={
        0 : 'N/A',
        1 : 'N/A',
        2 : 'STDBY_RC',
        3 : 'STDBY_XOSC',
        4 : 'FS',
        5 : 'Rx',
        6 : 'Tx'
    };
    this._status_cmd = {
        0 : 'N/A',
        1 : 'Cmd Successful',
        2 : 'Data Available',
        3 : 'Timed-out',
        4 : 'Cmd Error',
        5 : 'Failure to Execute Cmd',
        6 : 'Tx Done'
    };
    this._txBaseAddress = (options.hasOwnProperty('txBaseAddress')) ? options.txBaseAddress : 0x00;
    this._rxBaseAddress = (options.hasOwnProperty('rxBaseAddress')) ? options.rxBaseAddress : 0x00;
    this._modParams = (options.hasOwnProperty('modParams')) ? options.modParams : {modParam1: this.LORA_SF_7, modParam2:this.LORA_BW_400, modParam3:this.LORA_CR_4_5};
    this._pktParams = (options.hasOwnProperty('pktParams')) ? options.pktParams : {pktParam1: 0x0C, pktParam2:0x00, pktParam3:0x80, pktParam4:0x20, pktParam5:0x40, pktParam6:0x00, pktParam7:0x00};
    this._txParams = (options.hasOwnProperty('txParams')) ? options.txParams : {power: 0x1F, rampTime:this.RADIO_RAMP_20_US};
    this._irqMask = (options.hasOwnProperty('irqMask')) ? options.irqMask : {irqMask: [0x40,0x23]};
    this._dioMask = (options.hasOwnProperty('dioMask')) ? options.dioMask : {dio1Mask:[0x00,0x01], dio2Mask:[0x00,0x02], dio3Mask:[0x40,0x20]};

    this._spiBus = (options.hasOwnProperty('spiBus')) ? options.spiBus : 0;
    this._spiDevice = (options.hasOwnProperty('spiDevice')) ? options.spiDevice : 1;
    this._resetPin = (options.hasOwnProperty('resetPin')) ? options.resetPin : 17;
    this._busyPin = (options.hasOwnProperty('busyPin')) ? options.busyPin : 18;
    this._packetType = (options.hasOwnProperty('packetType')) ? options.packetType : this.PACKET_TYPE_LORA; //default
    this._regulatorMode = (options.hasOwnProperty('regulatorMode')) ? options.regulatorMode : 0x01;
    this._setRanging = (options.hasOwnProperty('setRanging')) ? options.setRanging : false;
    this._ranging = (options.hasOwnProperty('ranging')) ? options.ranging : false;
    this._status = (options.hasOwnProperty('status')) ? options.status : 0;
    this._rfFreq = (options.hasOwnProperty('rfFreq')) ? options.rfFreq : this.FREQ_24GHZ;
    this._autoFS = (options.hasOwnProperty('autoFS')) ? options.autoFS : false;

    this._debug = true;
}

util.inherits(SX128x, events.EventEmitter);

SX128x.prototype.sleep = async function sleep(m) {
    return new Promise(r => setTimeout(r,m));
};

SX128x.prototype._openSpi = async function(spiBus, spiDevice) {
    return new Promise ((resolve, reject) => {
        let spiObj = spi.open(spiBus, spiDevice, SPI_OPTIONS, err => {
            if (err) {
                console.error('Spi Open Failed');
                reject(err);
            }
            resolve(spiObj);
        })
    });
};

SX128x.prototype.open = async function() {
    this._busyGpio = new onoff.Gpio(this._busyPin, 'in','rising');
    this._resetGpio = new onoff.Gpio(this._resetPin, 'out');

    this._spi = await this._openSpi(this._spiBus, this._spiDevice);

    await this.reset();
    await this.sleep();

    await this.setRegulatorMode(this._regulatorMode);
    await this.setStandby('STDBY_RC');
    await this.setPacketType(this._packetType);
    await this.setRFFreq(this._rfFreq);
    await this.setBufferBaseAddr(this._txBaseAddress, this._rxBaseAddress);
    await this.setModulationParams(this._modParams);
    await this.setPacketParams(this._pktParams);
    await this.setTxParam(this._txParams);
    await this.clearIrqStatus([0xFF, 0xFF]);
    await this.autoFs(this._autoFS);
    this._trace('Radio Initialized');
};

SX128x.prototype.close = async function () {
    await new Promise((resolve,reject) => {
        this._spi.close(err => {
            if (error) {
                reject(err);
            }
            resolve();
        })
    });

    this._spi = null;
    this._busyGpio.unexport();
    this._resetGpio.unexport();
};

SX128x.prototype._convertStatus = function(status){
    let mode = (status & this._mode_mask)>>5;
    let cmdstat = (status & this._cmd_stat_mask)>>2;
    if( this._status_mode.hasOwnProperty(mode)){
        this._status_msg.mode=this._status_mode(mode);
    }
    if( this._status_cmd.hasOwnProperty(cmdstat) ) {
        this._status_msg.cmd = this._status_cmd(cmdstat);
    }
    this._status_msg.busy = !(status & 0x01);
    return this._status_msg;
};

SX128x.prototype._sendCommand = async function (command) {
    if(!this._spi){
        throw new Error('Spi not defined');
    }
    let sendCommand = {
        sendBuffer : command,
        byteLength : command.length,
        receiveBuffer: new Buffer.alloc(command.length)
    }

    return new Promise ((resolve, reject) => this._spi.transfer([sendCommand], function(err, messages) {
        if (err){
            reject(err);
        }
        if(messages[0].hasOwnProperty('receiveBuffer')){
            resolve(messages[0].receiveBuffer);
        }
        else{
            console.log('msg[0] keys: ' + Object.keys(messages[0]));
            resolve(messages[0]);
        }
    }));
};

SX128x.prototype._writeRegister = async function (addr1, addr2, data) {
    let sendBuffer= Buffer([this.WRITE_REGISTER, addr1, addr2, data]);
    this._trace('Writing to: '+ addr1 +' ' + addr2);
    this._sendCommand(sendBuffer);
};

SX128x.prototype._readRegister = async function (addr1, addr2) {
    this._trace('Reading: ' + addr1 + ' ' +addr2);

    let msg = new Buffer([this.READ_REGISTER, addr1, addr2]);
    let readMessage = {
        sendBuffer: msg,
        receiveBuffer: new Buffer.alloc(msg.length),
        byteLength: msg.length
    };
    if(!this._spi) {
        throw new Error ('Spi not defined while reading register');
    }
    return new Promise ((resolve,reject) => this._spi.transfer([readMessage], function(err,messages) {
        if (err){
            reject(err);
        }
        this._BUFFER = messages[0].receiveBuffer;
        resolve(messages[0].receiveBuffer);
    }));
    this._trace(this._BUFFER);
};

SX128x.prototype.reset =async function () {
    await this._resetGpio.writeSync(0);
    await this._resetGpio.writeSync(1);
};

SX128x.prototype.setRegulatorMode = async function (mode) {
    this._trace('Setting Regulator Mode');
    await this._sendCommand(Buffer([this.SET_REGULATOR_MODE, mode]));
};

SX128x.prototype.setStandby = async function (state) {
    this._trace('Setting Standby');
    if(state== 'STDBY_RC'){
        await this._sendCommand(Buffer([this.SET_STANDBY, 0x00]));
    }
    else if (state == 'STDBY_XOSC'){
        await this._sendCommand(Buffer([this.SET_STANDBY, 0x01]));
    }
};

SX128x.prototype.setPacketType = async function (type) {
    this._packetType = type;
    this._trace('Setting Packet Type');
    await this._sendCommand(Buffer([this.SET_PACKET_TYPE, this._packetType]));
};

SX128x.prototype.getPacketType = async function () {
    return await this._sendCommand(Buffer([this.GET_PACKET_TYPE, 0x00,0x00]))
};

SX128x.prototype.setCadParams = async function (symbol = this.LORA_CAD_16_SYMBOLS) {
    this._trace ('Setting CAD Parameters');
    await this._sendCommand(Buffer([this.SET_CAD_PARAMS,symbol]));
};

SX128x.prototype.setCad = async function () {
    this._trace('Setting CAD Search');
    await this._sendCommand(Buffer([this.SET_CAD]));
    await this.clearIrqStatus();
};

SX128x.prototype.setRFFreq = async function (freq = [0xB8, 0x9D, 0x88]) {
    //defaults: [0xB8,0x9D,0x88]
    //0xB89D89 = 12098953 PLL steps (2.4 GHz)
    //freq/(52000000/(2**18))
    this._trace('Setting RF Frequency');
    await this._sendCommand(Buffer([this.SET_RF_FREQUENCY,freq]));
};

SX128x.prototype.setBufferBaseAddr = async function (txBaseAddr = 0x00, rxBaseAddr = 0x00) {
    //defaults tx: 0x00, rx: 0x00 for maximum buffer size for each tx and rx, other default is rx: 0x00 and tx: 0x80
    this._trace('Setting Buffer Base Address');
    this._txBaseAddress = txBaseAddr;
    this._rxBaseAddress = rxBaseAddr;
    await this._sendCommand(Buffer([this.SET_BUFFER_BASE_ADDRESS, txBaseAddr, rxBaseAddr]));
};

SX128x.prototype.setModulationParams = async function ({modParam1, modParam2, modParam3}) {
    // LoRa: modParam1=SpreadingFactor, modParam2=Bandwidth, modParam3=CodingRate
    // LoRa with SF7, (BW1600=0x0A -> changed to BW400=0x26), CR 4/5
    // Must set PacketType first! - See Table 13-48,49,50
    this._trace('Setting Modulation Parameters');
    await this._sendCommand(Buffer([this.SET_MODULATION_PARAMS, modParam1, modParam2, modParam3]));
    if(this._packetType == this.PACKET_TYPE_LORA){
        if(modParam1 == this.LORA_SF_5 || this.LORA_SF_6){
            await this._writeRegister(0x09,0x25,0x1E);
        }
        else if (modParam1 == this.LORA_SF_7 || this.LORA_SF_8){
            await this._writeRegister(0x09,0x25,0x37);
        }
        else if (modParam1 == this.LORA_SF_9|| this.LORA_SF_10||this.LORA_SF_11||this.LORA_SF_12){
            await this._writeRegister(0x09,0x25,0x32);
        }
        else{
            console.Error('Invalid Spreading Factor');
        }
    }
};

SX128x.prototype.setPacketParams = async function ({pktParam1, pktParam2, pktParam3, pktParam4, pktParam5, pktParam6, pktParam7}) {
    //16 preamble symbols (0x0C) -> changed to 0x08
    //variable length (0x00)
    //128-byte payload (0x80)->changed to 15 (0x0F)
    //CRC disabled (0x00)
    //standard IQ (0x40) -> changed to inverted (0x00)
    let sendMessage = Buffer ([this.SET_PACKET_PARAMS, pktParam1, pktParam2, pktParam3, pktParam4, pktParam5, pktParam6, pktParam7]);

    await this._sendCommand(sendMessage);
};

SX128x.prototype.setTxParam = async function ({power = 0x1F, rampTime = this.RADIO_RAMP_20_US}) {
    //defaults=  power:0x1F, rampTime:0xE0
    //power=13 dBm (0x1F), rampTime=20us (0xE0). See Table 11-47
    // power = -18 + power (0x1f = 31) -> -18 + 31 = 13dBm
    this._trace('Setting Tx Params');
    await this._sendCommand(Buffer([this.SET_TX_PARAMS, power, rampTime]));
};

SX128x.prototype.writeBuffer = async function (data) {
    let sendBuffer
    if(Buffer.isBuffer(data)){
        sendBuffer = Buffer.concat([
            Buffer([this.WRITE_BUFFER, this._txBaseAddress]),
            data
        ]);
    } else{
        sendBuffer = Buffer([this.WRITE_BUFFER,this._txBaseAddress, data]);
    }
    let writeMessage = {
        sendBuffer : sendBuffer,
        byteLength : sendBuffer.length
    }
    if (0 < sendBuffer.length && sendBuffer.length <= 252){
        return new Promise ((resolve, reject) => this._spi.transfer([writeMessage], (err, messages)=>{
            if(err){
                reject(err);
            }
            //resolve(messages[0].receiveBuffer.readUInt8(1));
            resolve();
        }));
    }
    else{
        console.error('Error Writing buffer. Length out of Range');
    }
};

SX128x.prototype.readBuffer = async function (offset, payloadLen) {
    if(!this._spi){
        throw new Error('Spi not defined, while readBuffer');
    }

    let cmd = Buffer([this.READ_BUFFER, offset]);
    let sendCommand = {
        sendBuffer    : cmd,
        byteLength    : cmd.length,
        receiveBuffer : new Buffer.alloc(payloadLen)
    };

    return new Promise ((resolve, reject) =>this._spi.transfer([sendCommand], function(err, messages) {
        if(err){
            reject(err);
        }
        resolve(messages[0].receiveBuffer);
    }));

};

SX128x.prototype.dumpBuffer = async function () {
    let bufferOut = Buffer([this.READ_BUFFER, 0x00]);
    let sendCommand = {
        sendBuffer : bufferOut,
        byteLength : bufferOut.length,
        receiveBuffer : new Buffer.alloc(bufferOut.length)
    };
    return new Promise ((resolve, reject) => this._spi.transfer([sendCommand], function(err, messages){
        if(err){
            reject(err);
        }
        resolve(messages[0].receiveBuffer);
    }));
};

SX128x.prototype.setDioIrqParams = async function (irqMask, {dio1Mask, dio2Mask,dio3Mask}) {
    /*
    TxDone IRQ on DIO1, RxDone IRQ on DIO2, HeaderError and RxTxTimeout IRQ on DIO3
    IRQmask (bit[0]=TxDone, bit[1]=RxDone)
        0x43:       0x23
        0100 0011   0010 0011
    DIO1mask
        0000 0000   0000 0001
    DIO2mask
        0000 0000   0000 0010
    */
    this._trace('Setting Dio IRQ Parameters');
    await this._sendCommand(Buffer([this.SET_DIO_IRQ_PARAMS]+irqMask+dio1Mask+dio2Mask+dio3Mask));
};

SX128x.prototype.clearIrqStatus = async function (val) {
    //val default = [0xFF, 0xFF]
    this._trace('Clearing IRQ Status');
    await this._sendCommand(Buffer([this.CLR_IRQ_STATUS]+val));
};

SX128x.prototype.getIRqStatus = async function (clear) {
    this._trace('Getting IRQ Status');
    let _stat;
    _stat = await this._sendCommand(Buffer([this.GET_IRQ_STATUS, 0x00, 0x00, 0x00]));
    if (clear){
        await this._sendCommand(Buffer([this.CLR_IRQ_STATUS, 0xFF, 0xFF])); //Clear IRQ status
    }
    return _stat;
};

SX128x.prototype.setTx = async function (pBase = 0x02, pBaseCount = [0x00,0x00]) {
    //Activate transmit mode with no timeout. Tx mode will stop after first packet sent.
    //pBase default: [0x02]
    //pBaseCount default: [0x00, 0x00]
    this._trace('Setting Tx');
    await this.clearIrqStatus([0xFF,0xFF])
    await this._sendCommand(Buffer([this.SET_TX, pBase, pBaseCount[0], pBaseCount[1]]));
};

SX128x.prototype.setRx = async function (pBase = 0x02, pBaseCount = [0xFF,0xFF]) {
    //pBase default: [0x02]
    //pBaseCount default: [0xFF, 0xFF]
    /*
    pBaseCount = 16 bit parameter of how many steps to time-out
    see Table 11-22 for pBase values (0xFFFF=continuous)
    Time-out duration = pBase * periodBaseCount
    */
    this._trace('Setting Rx');
    await this.clearIrqStatus([0xFF,0xFF]);
    await this._sendCommand(Buffer([this.SET_RX, pBase, pBaseCount[0], pBaseCount[1]]))
};

SX128x.prototype.autoFs = async function (value = 0x01) {
    //default off not faster switching between continuous tx and rx operations
    this._autoFS = value;
    await this._sendCommand(Buffer([this.SET_AUTO_FS, value]));
};

SX128x.prototype.setRangingParams = async function (range_addr, master, slave) {
    //range_addr: [0x01,0x02,0x03,0x04]
    //master = false;
    //slave = false;
    await this.setRegulatorMode();
    await this.setPacketType(this.PACKET_TYPE_RANGING); //default LoRa
    await this.setStandby('STDBY_RC');
    await this.setModulationParams({modParam1:0x70, modParam2:0x0A, modParam3:0x03});  //SF7, BW1600, CR 4/7
    await this.setPacketParams({pktParam1: 0x08, pktParam2: 0x00, pktParam3:0x05, pktParam4:0x20, pktParam5:0x40});
    await this.setRFFreq(this.FREQ_RANGING);
    await this.setBufferBaseAddr(0x00,0x00);
    await this.setTxParam(this._txParams); //Default: power=13dBm, rampTime=20us
    if (slave){
        this._rangingRole = this.RANGING_SLAVE;
        //Slave Ranging Address
        this._writeRegister(0x90, 0x19, range_addr[0]);
        this._writeRegister(0x90, 0x18, range_addr[1]);
        this._writeRegister(0x90, 0x17, range_addr[2]);
        this._writeRegister(0x90, 0x16, range_addr[3]);
    }
    else if (master){
        this._rangingRole = this.RANGING_MASTER;
        //Master Ranging Address
        this._writeRegister(0x90, 0x15, range_addr[0]);
        this._writeRegister(0x90, 0x14, range_addr[1]);
        this._writeRegister(0x90, 0x13, range_addr[2]);
        this._writeRegister(0x90, 0x12, range_addr[3]);
    }
    else {
        console.error();('Select Master or Slave Only');
        return false
    }
    //Ranging address length
    this._writeRegister(0x90,0x31,0x30);
    //Ranging Calibration - SF7/BW1600=13528=0x34D8 per Section 3.3 of SemTech AN1200.29
    this._writeRegister(0x90, 0x2D, 0x04);
    this._writeRegister(0x90, 0x2C, 0x28);
    //Set Ranging Role
    await this._sendCommand(Buffer([this.SET_RANGING_ROLE, this._rangingRole]));
    if (slave){
        // Header Valid -> DIO1, Slave Response Done -> DIO2, Slave Request Discard -> DIO3
        await this.setDioIrqParams([0x01, 0x90], {dio1Mask:[0x00,0x01], dio2Mask:[0x00,0x80], dio3Mask:[0x00,0x01]});
    }
    else if (master){
        // Header Valid -> DIO1, Master Result Valid -> DIO2, Master Timeout -> DIO3
        await this.setDioIrqParams([0x0E, 0x10],{dio1Mask:[0x00,0x01], dio2Mask:[0x02,0x00], dio3Mask:[0x04,0x00]});
    }
    this._setRanging = true;
};

SX128x.prototype.range = async function () {
    if(!this._setRanging){
        console.log('Configure ranging parameters first');
        return false
    }
    if(self._rangingRole==this.RANGING_SLAVE){
        await this.setRx(0x02, [0xFF, 0xFF]);
    }
    else if (self._rangingRole == this.RANGING_MASTER){
        await this.setRx(0x02, [0x00, 0x00]);
    }
    this._ranging = true;
    //this._busyWait();
    return true
};

SX128x.prototype.readRange = async function (raw) {
    //raw = false
    if (!this._ranging){
        console.log('Start ranging before attempting to read');
        return
    }
    this.setStandby('STDBY_XOSC');
    // Enable LoRa Modem Clock
    let _temp, _conf, _val, _valLSB;
     _temp = await this._readRegister(0x90, 0x7F) | (1<<1);
    await this._writeRegister(0x90, 0x7F, _temp);
    // Set the ranging type for filtered or raw
    _conf = await this._readRegister(0x90,0x24);
    if(raw){
        _conf = (_conf & 0xCF) | 0x0; //This OR doesn't mean anything?
    }
    else {
        _conf = (_conf & 0xCF) | 0x10;
    }
    await this._writeRegister(0x90,0x24,_conf);
    //Read the 24-bit value (and convert to twos-complement)
    _val = await 0 | (this._readRegister(0x90,0x61)<<16);
    _val |= await (this._readRegister(0x90,0x62)<<8);
    _val |= await (this._readRegister(0x90,0x62));

    if (raw){
        _valLSB = _val;
        // Handle twos-complement
        if(((1<<23) & _valLSB) !=0 ){
            _valLSB = (((~_valLSB) & ((1<<24) - 1 )) + 1) / (1625.0e3)*36621.09;
        }
        else {
            _valLSB = _valLSB / (1625.0e3) * 36621.09;
        }
    }
    else {
        // Filtered value
        _valLSB = _val * 20.0 / 100.0;
    }
    await this.setStandby('STDBY_RC');
    return _valLSB;
};

SX128x.prototype.getPacketStatus = async function () {
    // see Table 11-63
    this._pktStatus = [];
    this._pktStatus = await  this._sendCommand(Buffer([this.GET_PACKET_STATUS,NOP,NOP,NOP,NOP,NOP,NOP]));
    // for LoRa and Ranging should return: [rssiSync, snr, -,-,-]
    if(this._packetType == this.PACKET_TYPE_LORA || this.PACKET_TYPE_RANGING){
        this.rssiSync = (-1*(this._pktStatus[2])/2);
        this.snr = (this._pktStatus[3]/4);
        return {rssiSync: this.rssiSync, snr: this.snr};
    }
    else{
        this.rssiSync = (-1*(p_stat[3])/2);
        return {rfu: this._pktStatus[2],rssiSync: this.rssiSync, errors: this._pktStatus[4],status: this._pktStatus[5], sync: this._pktStatus[6]};
    }
};

SX128x.prototype.getRxBufferStatus = async function () {
    //should return [0x00, rxPayloadLength, rxStartBufferPointer]
    return await this._sendCommand(Buffer([this.GET_RX_BUFFER_STATUS, 0x00,0x00,0x00]));
};

SX128x.prototype.send = async function (data) {
    /*
       Send a string of data using the transmitter.
       You can only send 252 bytes at a time
       (limited by chip's FIFO size and appended headers).
    */
    let msg = new Buffer(data);
    this._trace("Sending: " + msg);
    if (msg.length <= 252 ){
        let pktParam = this._pktParams;
        pktParam.pktParam3 = msg.length;
        await this.setPacketParams(pktParam);
        await this.writeBuffer(msg);
        await this.setTx();
    }
};

SX128x.prototype.listen = async function (enable) {
    if (enable) {
        //this.setDioIrqParams()
        await this.setRx([0x04],[0xFF,0xFF]);
        this._listen = true;
    }
    else{
        this.setStandby('STDBY_RC');
        this._listen = false;
    }
};

SX128x.prototype.receive = async function (continuous = true, keep_listening=true) {
    if(!this._listen){
        this._listen = true
    }
    if (continuous){
        this._bufStatus = await this.getRxBufferStatus();
        //should return [0x00, rxPayloadLength, rxStartBufferPointer]
        //console.log('Buff Status keys: ' + Object.keys(this._bufStatus));
        //console.log('Buff Status[0]: ' + this._bufStatus[0]);
        //console.log('Buff Status[1]: ' + this._bufStatus[1]);
        //console.log('Buff Status[2]: ' + this._bufStatus[2]);
        //console.log('Buff Status[3]: ' + this._bufStatus[3]);
        this._packetLen = this._bufStatus[2];
        //console.log('Packet Length: ' + this._packetLen);
        this._packetPointer = this._bufStatus[3];
        //console.log('Packet Pointer: ' + this._packetPointer);
        if (this._packetLen > 0){
            this._trace('Offset: ' + this._packetPointer + ' Length: ' + this._packetLen);
            let packet = await this.readBuffer(this._packetPointer, this._packetLen)
            //console.log('packet keys: ' + Object.keys(packet));
            /*for (var i = 0; i < packet.length; i++) {
                //console.log('packet['+i+'] '+ packet[i]);
            }*/
            if(!keep_listening){
                self._listen = false;
            }
            return packet;
        }
    }
};

SX128x.prototype.packetInfo = function () {
    return {pktLen: this._packetLen, pktPtr: this._packetPointer};
};

SX128x.prototype.Rssi = async function () {
    this._rssi = await this._sendCommand(Buffer([this.GET_RSSI_INST,NOP,NOP]));
    return this._rssi;
};

SX128x.prototype.status = async function () {
    let a = await this._sendCommand(Buffer([this.GET_STATUS]))[0]
    if (a){
        return this._convertStatus(a);
    }
};

module.exports = SX128x;
