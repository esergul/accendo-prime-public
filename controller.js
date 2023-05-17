const DualSense = require('node-dualsense/src/DualSense')
const decode = require('node-dualsense/src/decode');

document.addEventListener("DOMContentLoaded", init);

/**
const controller = new DualSense(true);

controller.on('error', (err) => {
	console.log(err);
	controller.cose();
	run = false;
});

let last = null;
controller.on('data', (data) => {
	if (last !== null && last === data) {
		return ;
	}
	last = data;
	console.log(decode(data));
});
*/
const scale = (fromRange, toRange) => {
    const d = (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0]);
    return from =>  (from - fromRange[0]) * d + toRange[0];
};

let highlightHandler = null;

function steer(amount) {

    let value = scale([0, 255], [-100, 100])(amount);   //todo: enter correct range of the controller from left to right

    const marginLeft = scale([0, 100], [0, 15])(Math.abs(value)) * -1 * Math.sign(value); 

    return marginLeft;
}

function throttle(controllerX, controllerY) {    
 
    let value = scale([-255, 255], [-255, 255])(controllerY);   //todo: enter correct range of the controller from bottom to top
    const marginTop = scale([-255, 255], [18, -2])(value); 
    const marginLeft = steer(controllerX);

    $(".roll_in_in").addClass("active");   
    
    $(".roll_in_in").animate({
        "margin-top" : marginTop + 'px',
        "margin-left" : marginLeft + 'px'
    }, 200, kickTimer);  

    //todo: FORWARD or BACKWARD, STEER, THROTTLE commands

    function kickTimer() {
        if(highlightHandler) {
            clearTimeout(highlightHandler);
        };

        highlightHandler = setTimeout(function () { 
            $('.roll_in_in').removeClass('active');
        }, 250);

        //todo: STOP command
    }
}

function init() {
    throttle(126, -255);
    throttle(126, 0);
    throttle(126, 255);
    throttle(0, 0);
    throttle(255, 0);
    throttle(255, 255);
    throttle(0, 255);
    throttle(64, 0);
    throttle(126, -255);
}
