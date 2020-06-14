/**
* @description Dell serial commands for controlling and quering remore DUT.
* @author Jeethendra Telagu
* @version v0.1.0
*/

module.export = {
    send_data: function(input_port, data) {
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
    });
    myPort.on("close", function (err) {
        if (err) {
            console.log('Error closing port: ', err.message);
            return -1;
        }
    });
        console.log('port closed');
        return 0;
},

get_data: function (input_port) {
    var serialport = require('serialport');
    //   var SerialPort = serialport.SerialPort;

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
        parser.on('data', readSerialData);
    });
    myPort.on("close", function (err) {
        if (err)
            return console.log('Error on close', err.message);
        condole.log('port closed');
    });
    return data;
},

readSerialData: function (data) {
    console.log(data);
}

};

