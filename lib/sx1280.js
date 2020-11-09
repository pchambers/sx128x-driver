let util = require('util');
let events = require('events');

let onoff = require('onoff');
let spi = require('spi-device');

let SPI_OPTIONS = {
  mode: spi.MODE0,
  maxSpeedHz: 12E6
};


/*!
 * \brief Used to display firmware version on TFT (Utilities menu)
 */
let FIRMWARE_VERSION = ( ( char* )"v1.6" );
let FIRMWARE_DATE = ( ( char* )"2019-02-15" );

/*!
 * \brief Define range of central frequency [Hz]
 */
let DEMO_CENTRAL_FREQ_MIN = 2400000000UL;
let DEMO_CENTRAL_FREQ_MAX = 2483500000UL;

/*!
 * \brief Define 3 preset central frequencies [Hz]
 */
let DEMO_CENTRAL_FREQ_PRESET1 = 2402000000UL;
let DEMO_CENTRAL_FREQ_PRESET2 = 2450000000UL;
let DEMO_CENTRAL_FREQ_PRESET3 = 2480000000UL;

/*!
 * \brief Define 5 preset ranging addresses
 */
let DEMO_RNG_ADDR_1 = 0x10000000;
let DEMO_RNG_ADDR_2 = 0x32100000;
let DEMO_RNG_ADDR_3 = 0x20012301;
let DEMO_RNG_ADDR_4 = 0x20000abc;
let DEMO_RNG_ADDR_5 = 0x32101230;

/*!
 * \brief Define antenna selection for ranging
 */
let DEMO_RNG_ANT_1 = 1;
let DEMO_RNG_ANT_0 = 2;
let DEMO_RNG_ANT_BOTH = 0;

/*!
 * \brief Define units for ranging distances
 */
let DEMO_RNG_UNIT_CONV_M = 1.0; // not used
let DEMO_RNG_UNIT_CONV_YD = 1.0936;
let DEMO_RNG_UNIT_CONV_MI = 6.2137e-4;
let DEMO_RNG_UNIT_SEL_M = 0;
let DEMO_RNG_UNIT_SEL_YD = 1;
let DEMO_RNG_UNIT_SEL_MI = 2;

/*!
 * \brief Define min and max Tx power [dBm]
 */
let DEMO_POWER_TX_MIN = -18;
let DEMO_POWER_TX_MAX = 13;

/*!
 * \brief Define min and max ranging channels count
 */
const uint16_t DEMO_RNG_CHANNELS_COUNT_MAX = 255;
const uint16_t DEMO_RNG_CHANNELS_COUNT_MIN = 10;

/*!
 * \brief Define min and max Z Score for ranging filtered results
 */
let DEMO_RNG_ZSCORE_MIN = 1;
let DEMO_RNG_ZSCORE_MAX = 5;

/*!
 * \brief Define min and max payload length for demo applications
 */
let DEMO_MIN_PAYLOAD = 12;
let DEMO_FLRC_MAX_PAYLOAD = 127;
let DEMO_GFS_LORA_MAX_PAYLOAD = 255;

const t0 =       -0.016432807883697;                         // X0
const t1 =       0.323147003165358;                          // X1
const t2 =       0.014922061351196;                          // X1^2
const t3 =       0.000137832006285;                          // X1^3
const t4 =       0.536873856625399;                          // X2
const t5 =       0.040890089178579;                          // X2^2
const t6 =       -0.001074801048732;                         // X2^3
const t7 =       0.000009240142234;                         // X2^4

const p = { 0,-4.1e-9,1.03e-7,1.971e-5,-0.00107,0.018757,0.869171,3.072450 };

const BUFFER_SIZE = 255;
const PINGPONGSIZE = 4;
const PER_SIZE = 3;

/*!
 * \brief Define time used in PingPong demo to synch with cycle
 * RX_TX_INTER_PACKET_DELAY is the free time between each cycle (time reserve)
 */
let RX_TX_INTER_PACKET_DELAY = 150;  // ms
let RX_TX_TRANSITION_WAIT = 15;   // ms


/*!
 * \brief Size of ticks (used for Tx and Rx timeout)
 */
let RX_TIMEOUT_TICK_SIZE = RADIO_TICK_SIZE_1000_US;

let RNG_TIMER_MS = 384; // ms
let RNG_COM_TIMEOUT = 100; // ms
