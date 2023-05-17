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

const DIRECTIONS = {
    FORWARD : 1,
    BACKWARDS : -1,
    RIGHT : 2,
    LEFT : 3
}

let highlightHandler = null;

function throttle(dir, amount) {    //todo: instead of 4 directions have dir take a numeric value and map it between -100 and 100
    //$(".roll_in").toggleClass("active");   
    $(".roll_in_in").addClass("active");   
    
    switch(dir) {
        case DIRECTIONS.FORWARD:
            $(".roll_in_in").animate({
                "margin-top" : '-8px',
                "margin-right" : '0px', 
                "margin-left" : '0px'
            }, 200, kickTimer);   //todo: play with the number according to 'amount'
            //todo: FORWARD + STEER + THROTTLE
            break;
        case DIRECTIONS.BACKWARDS:
            $(".roll_in_in").animate({
                "margin-top" : '12px',
                "margin-right" : '0px', 
                "margin-left" : '0px'
            }, 200, kickTimer); 
            //todo: BACKWARD + STEER + THROTTLE  
            break;  
        case DIRECTIONS.RIGHT:
            $(".roll_in_in").animate({
                "margin-left" : '10px',
                "margin-right" : '0px',
                "margin-top" : '7px'
            }, 200, kickTimer);   
            break;  
        case DIRECTIONS.LEFT:
            $(".roll_in_in").animate({
                "margin-left" : '-10px', 
                "margin-right" : '0px',
                "margin-top" : '7px'
            }, 200, kickTimer);   
            break;  
    }

    function kickTimer() {
        if(highlightHandler) {
            clearTimeout(highlightHandler);
        };

        highlightHandler = setTimeout(function () { 
            $('.roll_in_in').removeClass('active');
        }, 200);

        //todo: STOP
    }
}

function init() {
    throttle(DIRECTIONS.RIGHT);
    throttle(DIRECTIONS.LEFT);
    throttle(DIRECTIONS.FORWARD);
    throttle(DIRECTIONS.BACKWARDS);

}
