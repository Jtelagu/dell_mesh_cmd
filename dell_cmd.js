/**
* @description Dell serial commands for controlling and quering remote DUT.
* @author Jeethendra Telagu
* @version v0.1.0
*/
const DELL_EC_POWER_ON = "/system start";
const DELL_EC_POWER_OFF = "/system stop";
const DELL_EC_CLEAR_CONSOLE = '\r';
const DELL_EC_POWER_STATUS = "/system show pwr";

const DELL_EC_POWER_ON_RES = "pwr=on";
const DELL_EC_POWER_OFF_RES = "pwr=off";


send_data = function (input_port, data) {
    console.log("send");
    var serialport = require('serialport');
    var myPort = new serialport(input_port, {
        baudRate: 115200,
    });
    myPort.on("open", function (err) {
        if (err) {
            console.log('Error opening port: ', err.message);
            return -1;
        }
        console.log('port opened');
        myPort.write(data, function (err) {
            if (err) {
                console.log('Error on write', err.message);
                return -1;
            }
            console.log('Port.write: ', data);
        });
        myPort.on("close", function (err) {
            if (err) {
                console.log('Error closing port: ', err.message);
                return -1;
            }
            console.log('port closed');
        });

    });
    return 0;
},

    get_data = function (input_port) {
        var serialport = require('serialport');
        var myPort = new serialport(input_port, {
            baudRate: 115200,
        });

        myPort.on("open", function (err) {
            if (err)
                return console.log('Error opening port: ', err.message)
            console.log('port opened');

            var Readline = serialport.parsers.Readline; // make instance of Readline parser
            var parser = new Readline(); // make a new parser to read ASCII lines
            myPort.pipe(parser); // pipe the serial stream to the parser

            console.log('Listning..');
            var input_data = parser.on('data', readSerialData);

            myPort.on("close", function (err) {
                if (err)
                    return console.log('Error on close', err.message);
                condole.log('port closed');
            });
            return input_data;

        });

    },

    readSerialData = function (indata) {
        console.log(indata);
    },

    get_dut_status = function (input_port, cmd) {
        console.log("send");
        var serialport = require('serialport');
        var myPort = new serialport(input_port, {
            baudRate: 115200,
        });
        myPort.on("open", function (err) {
            if (err) {
                console.log('Error opening port: ', err.message);
                return -1;
            }
            console.log('port opened');
            // Add a newline to evaluate the command here.
            cmd += DELL_EC_CLEAR_CONSOLE;
            myPort.write(cmd, function (err) {
                if (err) {
                    console.log('Error on write', err.message);
                    return -1;
                }
                console.log('Port.write: ', cmd);
                var Readline = serialport.parsers.Readline; // make instance of Readline parser
                var parser = new Readline(); // make a new parser to read ASCII lines
                myPort.pipe(parser); // pipe the serial stream to the parser
                console.log('Listning..');
                parser.on('data', readSerialData);
            });
            myPort.on("close", function (err) {
                if (err) {
                    console.log('Error closing port: ', err.message);
                    return -1;
                }
                console.log('port closed');
            });

        });
        return 0;
    },

    dell_ec_power_action = function (input_port, state) {
        var seconds = 30;

        switch (state) {
            case 'OFF':
                var power_state = DELL_EC_POWER_OFF;
                break;

            case 'ON':
                var power_state = DELL_EC_POWER_ON;
                break;

            case 'STATUS':
                var power_state = DELL_EC_POWER_STATUS;
                break;

            default:
                console.log("Invalid power state given");
                return -1;
        }

        if (state == 'STATUS') {
            var res = get_dut_status(input_port, power_state, function (err) {
                if (err) {
                    console.log('Error sending data: ', err.message)
                    return -1;
                }
            });
            return res;
        } else {
            send_data(input_port, power_state, function (err) {
                if (err) {
                    console.log('Error opening port: ', err.message);
                    return -1;
                }
                var waitTill = new Date(new Date().getTime() + seconds * 1000);
                while (waitTill > new Date()) { }
                return 0;

            });
        }

    }

module.exports = { send_data, get_data, dell_ec_power_action };