module.exports : {
    //Register Functions:
    GET_STATUS                  : 0xC0,
    WRITE_REGISTER              : 0x18,
    READ_REGISTER               : 0x19,
    WRITE_BUFFER                : 0x1A,
    READ_BUFFER                 : 0x1B,
    SET_SLEEP                   : 0x84,
    SET_STANDBY                 : 0x80,
    SET_FS                      : 0xC1,
    SET_TX                      : 0x83,
    SET_RX                      : 0x82,
    SET_RX_DUTY_CYCLE           : 0x94,
    SET_CAD                     : 0xC5,
    SET_TX_CONTINUOUS_WAVE      : 0xD1,
    SET_TX_CONTINUOUS_PREAMBLE  : 0xD2,
    SET_PACKET_TYPE             : 0x8A,
    GET_PACKET_TYPE             : 0x03,
    SET_RF_FREQUENCY            : 0x86,
    SET_TX_PARAMS               : 0x8E,
    SET_CAD_PARAMS              : 0x88,
    SET_BUFFER_BASE_ADDRESS     : 0x8F,
    SET_MODULATION_PARAMS       : 0x8B,
    SET_PACKET_PARAMS           : 0xBC,
    GET_RX_BUFFER_STATUS        : 0x17,
    GET_PACKET_STATUS           : 0x1D,
    GET_RSSI_INST               : 0x1F,
    SET_DIO_IRQ_PARAMS          : 0x8D,
    GET_IRQ_STATUS              : 0x15,
    CLR_IRQ_STATUS              : 0x97,
    SET_REGULATOR_MODE          : 0x96,
    SET_SAVE_CONTEXT            : 0xD5,
    SET_AUTO_FS                 : 0x9E,
    SET_AUTO_TX                 : 0x98,
    SET_PERF_COUNTER_MODE       : 0x9C,
    SET_LONG_PREAMBLE           : 0x9B,
    SET_UART_SPEED              : 0x9D,
    SET_RANGING_ROLE            : 0xA3,
    SET_ADVANCED_RANGING        : 0x9A,

    //Packet Types:
    PACKET_TYPE_GFSK            : 0x00,
    PACKET_TYPE_LORA            : 0x01,
    PACKET_TYPE_RANGING         : 0x02,
    PACKET_TYPE_FLRC            : 0x03,
    PACKET_TYPE_BLE             : 0x04,

    //Frequency Selection:
    FREQ_24GHZ                  : [0xB8,0x9D,0x88],
    FREQ_RANGING                : [0xB8,0x9D,0x80],

    //Modulation Params:
    //modParam1 - Spreading Factor:
    LORA_SF_5                   : 0x50,
    LORA_SF_6                   : 0x60,
    LORA_SF_7                   : 0x70,
    LORA_SF_8                   : 0x80,
    LORA_SF_9                   : 0x90,
    LORA_SF_10                  : 0xA0,
    LORA_SF_11                  : 0xB0,
    LORA_SF_12                  : 0xC0,

    //modParam2 - Bandwidth:
    LORA_BW_1600                : 0x0A,     //1625.0   kHz
    LORA_BW_800                 : 0x18,     // 812.5   kHz
    LORA_BW_400                 : 0x26,     // 406.25  kHz
    LORA_BW_200                 : 0x34,     // 203.125 kHz

    //modParam 3 - Coding Rate:
    LORA_CR_4_5                 : 0x01,     // 4/5
    LORA_CR_4_6                 : 0x02,     // 4/6
    LORA_CR_4_7                 : 0x03,     // 4/7
    LORA_CR_4_8                 : 0x04,     // 4/8
    LORA_CR_LI_4_5              : 0x05,     // 4/5
    LORA_CR_LI_4_6              : 0x06,     // 4/6
    LORA_CR_LI_4_7              : 0x07,     // 4/8s

    //Ranging:
    RANGING_SLAVE               : 0x00,
    RANGING_MASTER              : 0x01,

    //Radio Ramping:
    RADIO_RAMP_02_US            : 0x00,     //2 us
    RADIO_RAMP_04_US            : 0x20,     //4 us
    RADIO_RAMP_06_US            : 0x40,     //6 us
    RADIO_RAMP_08_US            : 0x60,     //8 us
    RADIO_RAMP_10_US            : 0x80,     //10 us
    RADIO_RAMP_12_US            : 0xA0,     //12 us
    RADIO_RAMP_16_US            : 0xC0,     //16 us
    RADIO_RAMP_20_US            : 0xE0,     //20 us

    //LoRa Channel Activity Detected Symbol Number Definitions
    LORA_CAD_01_SYMBOL          : 0x00,     //1 Symbol
    LORA_CAD_02_SYMBOLS         : 0x20,     //2 Symbols
    LORA_CAD_04_SYMBOLS         : 0x40,     //4 Symbols
    LORA_CAD_08_SYMBOLS         : 0x60,     //8 Symbols
    LORA_CAD_16_SYMBOLS         : 0x80,     //16 Symbols


},
