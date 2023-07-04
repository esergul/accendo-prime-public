const {Dualsense} = require('dualsense-ts')
import {CommandOperator} from "./commandOperator.js"
import {logger} from "./logger.js"

const controller = new Dualsense();
let commandOperator = new CommandOperator();

const scale = (fromRange, toRange) => {
    const d = (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0]);
    return from =>  (from - fromRange[0]) * d + toRange[0];
};

function steer(amount) {
    let value = amount * 100;

    return scale([0, 100], [0, 15])(Math.abs(value)) * Math.sign(value);
}

function init() {
    logger.log("Flat Earth Drifters are ready for the ride!");

    controller.connection.on("change", ({ active }) => {
        $("#indicator-led").toggleClass("led-red led-green")
        $("#indicator-text").html(`${active ? '' : 'dis'}connected`);
    });

    controller.left.analog.on("change", ({ x, y }) => {
        adjustSteer(x, y);
    });

    controller.triangle.on("change", (input) => {
        $(".triangle").toggleClass("activeButton", input.active);
        if(input.active) {
            commandOperator.ping();
            logger.log("Ping command sent");
        }
    });

    controller.square.on("change", (input) => {
        $(".carre").toggleClass("activeButton", input.active);
        if(input.active) {
            commandOperator.blink();
            logger.log("Blink command sent");
        }
    });

    controller.cross.on("change", (input) => {
        $(".croix").toggleClass("activeButton", input.active);
        if (input.active) {
            commandOperator.launchCommandSeeding();
            logger.log("Move command sent");
        }
    });

    controller.circle.on("change", (input) => {
        $(".rond").toggleClass("activeButton", input.active)
        if(input.active) {
            commandOperator.stopAndClear();
            $('#direction-value').html("STOP");
            $('#throttle-value').html("0");
            $('#steer-value').html("0");
            logger.log("Stop command sent");
        }
    });

    controller.dpad.on("change", (dpad, input) => {
        switch(input.name) {
            case "Up":
                $(".fleche_dir_top").toggleClass("activeButton", input.active);
                break;
            case "Down":
                $(".fleche_dir_bottom").toggleClass("activeButton", input.active);
                break;
            case "Left":
                $(".fleche_dir_left").toggleClass("activeButton", input.active);
                break;
            case "Right":
                $(".fleche_dir_right").toggleClass("activeButton", input.active);
                break;
        }
    });

    let l2State = {};
    let r2State = {};
    let l2fxnId = {};
    let r2fxnId = {};

    controller.left.trigger.on("change", (input) => triggerEvent(input, l2State, -1, l2fxnId) );
    controller.right.trigger.on("change", (input) => triggerEvent(input, r2State, 1, r2fxnId) );

    function triggerEvent(input, state, value, fxnId){

        if(!state.value || state.value < input.state) {  //pressing
            adjustThrottle(value);

            if(input.state > 0.99) { //keep using adjust until release event comes
                if(!fxnId.id) {
                    fxnId.id = setInterval(() => adjustThrottle(value), 1);
                }
            }
        } else {
            clearInterval(fxnId.id);
            fxnId.id = null;
        }

        state.value = input.state;
    }

    function adjustThrottle(direction) {
        let currentThrottle = Number($('#throttle-value').html());

        currentThrottle += Math.sign(direction);
        currentThrottle = (currentThrottle > 0 ? Math.min(currentThrottle, 255) : Math.max(currentThrottle, -255) );

        const engineState = currentThrottle > 4 ? "FORWARD" : (currentThrottle < -4 ? "BACKWARD" : "STOP");
        commandOperator.updateEngineState(engineState);
        commandOperator.updateThrottle(Math.abs(currentThrottle));

        $('#direction-value').html(engineState);
        $('#throttle-value').html(currentThrottle);

        if(Math.abs(currentThrottle) > 100) {
            controller.rumble(scale([100, 255], [0, 1])(Math.abs(currentThrottle))); //todo: make this permanent (so that it doesn't stop after a while)
        } else {
            controller.rumble(0);
        }

        return Math.abs(currentThrottle);
    }

    function adjustSteer(controllerX, controllerY) {
        let currentSteer;

        const marginTop = scale([-1, 1], [18, -2])(controllerY);
        const marginLeft = steer(controllerX);

        $(".roll_in_in").addClass("active");

        $(".roll_in_in").css({
            "margin-top" : marginTop + 'px',
            "margin-left" : marginLeft + 'px'
        });

        if(marginTop > 5.5 && marginTop < 8.5 && marginLeft > -1 && marginLeft < 1) {
            $('.roll_in_in').removeClass('active');
        }

        currentSteer = Math.floor(controllerX * 100);

        commandOperator.updateSteer(currentSteer);
        $('#steer-value').html(currentSteer);

        return currentSteer;
    }
}

if(document.readyState !== "loading"){
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
