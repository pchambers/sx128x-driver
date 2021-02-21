var SX128x = require('../lib/sx128x');

var options = {
    txBaseAddress: 0x00,
    rxBaseAddress: 0x00,
    modParams : { spreadingFactor: SX128x.LORA_SF_7, bandwidth:SX128x.LORA_BW_400,codingRate:SX128x.LORA_CR_4_5},
    pktParams : {pktParam1: SX128x.LORA_PBLE_12_SYMB, pktParam2:SX128x.LORA_PKT_VARIABLE_LENGTH, pktParam3:SX128x.RADIO_RX_MATCH_SYNCWORD_OFF, pktParam4:SX128x.LORA_CRC_ENABLE, pktParam5:SX128x.LORA_IQ_STD, pktParam6:0x00, pktParam7:0x00},
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
module.exports = options;
