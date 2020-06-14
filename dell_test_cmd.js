/**
* @description Dell serial commands for controlling and quering remote DUT.
* @author Jeethendra Telagu
* @version v0.1.0
*/

var COM = 'COM4';


function ec_power_test() {

    var ec = new require('./dell_ec').CreateDellCmd();

    //get EC power status
    ec.set_port('COM4');
    var state = ec.dell_ec_power_action('STATUS', function (state) {
        if (state < 0) {
            console.log("Failed to communicate with EC");
            return -1;
        } else if (state == 0) {
            console.log("EC command successful");
            return 0;
        } else if (state == 'pwr=on') {
            console.log("DUT in ON state");
            // power off DUT
            ecpower.dell_ec_power_action('OFF');
        } else if (state == 'pwr=off') {
            //power ON DUT
            console.log("DUT in OFF state");
            ecpower.dell_ec_power_action('ON');
        }
    });

}

ec_power_test();