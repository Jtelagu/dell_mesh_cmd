/**
* @description Dell serial commands for controlling and quering remote DUT.
* @author Jeethendra Telagu
* @version v0.1.0
*/

module.exports.CreateDellCmd = function () {
    const DELL_EC_POWER_ON = "/system start";
    const DELL_EC_POWER_OFF = "/system stop";
    const DELL_EC_CLEAR_CONSOLE = '\r';
    const DELL_EC_POWER_STATUS = "/system show pwr";

    const DELL_EC_POWER_ON_RES = "pwr=on";
    const DELL_EC_POWER_OFF_RES = "pwr=off";

    var input_port = null;
    var pwr_status = null;
    var response = null;

    var myPort = null;

    var obj = {};

    obj.set_port = function (port) {
        this.input_port = port;
    };

    obj.get_power_status = function () {
        return this.pwr_status;
    };

    obj.get_response = function () {
        return this.response;
    };

    obj.open_port = function () {
        var serialport = require('serialport');
        this.myPort = new serialport(this.input_port, {
            baudRate: 115200,
        });
        this.myPort.on("open", function (err) {
            if (err) {
                console.log('Error opening port: ', err.message);
                return -1;
            }
            console.log('port opened');
            return 0;
        });
    };

    obj.close_port = function () {
        this.myPort.on("close", function (err) {
            if (err) {
                console.log('Error on close', err.message);
                return -1;
            }
            condole.log('port closed');
            return 0;
        });
    };

    obj.send_cmd = function (cmd) {
       
        obj.open_port(function (err) {
            if (err) {
                console.log('Error opening port: ', err.message);
                return -1;
            }
            console.log('port opened');
            cmd += DELL_EC_CLEAR_CONSOLE;

            this.myPort.write(cmd, function (err) {
                
                if (err) {
                    console.log("Error on write", err.message);
                    return -1;
                }
                console.log('port.write:',cmd);
                obj.close_port(function (err) {
                    if (err)
                        return -1;

                    condole.log('port closed');
                    return 0;
                });

            });

        });
        return 0;
    };

    obj.readSerialData = function (indata) {
        console.log(indata);
        this.response = indata;            
    };

    obj.send_status_cmd = function (cmd) {
        console.log("send");
        
        obj.open_port("open", function (err) {

            if (err)
                return -1;
      
            console.log('port opened');
            // Add a newline to evaluate the command here.
            cmd += DELL_EC_CLEAR_CONSOLE;
            this.myPort.write(cmd, function (err) {
                if (err) {
                    console.log('Error on write', err.message);
                    obj.close_port();
                    return -1;
                }
                console.log('Port.write: ', cmd);
                var Readline = serialport.parsers.Readline; // make instance of Readline parser
                  
                // var parser = new Readline(); // make a new parser to read ASCII lines
                this.myPort.pipe(parser); // pipe the serial stream to the parser
                const parser = this.myPort.pipe(new Readline({ delimiter: '\r\n' }));
                console.log('Listning..');

                parser.on('data', function (data) {
                    console.log(data);
                    this.pwr_status = data;
                    obj.close_port(function (err) {
                        if (err) 
                            return -1;
                        console.log('port closed');
                    });
                    return 0;
                });

            });
     
        });
        return 0;
    };

    obj.dell_ec_power_action = function (state) {
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
            var res = obj.send_status_cmd(power_state, function (err) {
                if (err) {
                    console.log('Error sending data: ', err.message)
                    return -1;
                }
                return obj.get_power_status();
            });
        } else {
            obj.send_cmd(power_state, function (err) {
                if (err) {
                    console.log('Error opening port: ', err.message);
                    return -1;
                }
                var waitTill = new Date(new Date().getTime() + seconds * 1000);
                while (waitTill > new Date()) { }

                power_state = DELL_EC_POWER_STATUS;

                var res = obj.send_status_cmd(power_state, function (err) {
                    if (err) {
                        console.log('Error getting response: ', err.message)
                        return -1;
                    }
                    return obj.get_power_status();
                });

            });
        }

    };
    return obj;
};
