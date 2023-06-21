const {Dualsense} = require('dualsense-ts')
import {CommandOperator} from "./commandOperator.js"

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

function throttle(controllerX, controllerY) {
    const marginTop = scale([-1, 1], [18, -2])(controllerY);
    const marginLeft = steer(controllerX);

    $(".roll_in_in").addClass("active");

    $(".roll_in_in").css({
        "margin-top" : marginTop + 'px',
        "margin-left" : marginLeft + 'px'
    });

    controller.rumble(1.0);

    if(marginTop > 5.5 && marginTop < 8.5 && marginLeft > -1 && marginLeft < 1) {
        $('.roll_in_in').removeClass('active');
    }

    commandOperator.updateSteer(Math.floor(controllerX * 100));

    if (controllerY > 0.06) {
        commandOperator.updateEngineState("FORWARD");
    } else if (controllerY < -0.06) {
        commandOperator.updateEngineState("BACKWARD");
    } else {
        commandOperator.updateEngineState("STOP");
        controller.rumble(0);
    }  

    if (controllerY > 0) {
        commandOperator.updateThrottle(Math.floor(controllerY * 256))
    } else if (controllerY < 0) {
        commandOperator.updateThrottle(Math.floor(-controllerY * 256))
    }
}

async function init() {
    controller.connection.on("change", ({ active }) => {
        $("#indicator-led").toggleClass("led-red led-green")
        $("#indicator-text").html(`${active ? '' : 'dis'}connected`);
    });

    controller.left.analog.on("change", ({ x, y }) => {
        adjustSteer(x, y);
        //throttle(x, y);

    });

    controller.triangle.on("change", (input) => {
        $(".triangle").toggleClass("activeButton", input.active);
        if(input.active) {
            commandOperator.ping();
        }
    });

    controller.square.on("change", (input) => {
        $(".carre").toggleClass("activeButton", input.active);
        if(input.active) {
            commandOperator.blink();
        }
    });

    controller.cross.on("change", (input) => {
        $(".croix").toggleClass("activeButton", input.active);
        if(input.active) {
            //commandOperator.look();
        }
    });

    controller.circle.on("change", (input) => {
        $(".rond").toggleClass("activeButton", input.active)
        if(input.active) {
            commandOperator.stop();
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
    let fxnId = null;

    controller.left.trigger.on("change", (input) => triggerEvent(input, l2State, -1) );
    controller.right.trigger.on("change", (input) => triggerEvent(input, r2State, 1) );

    function triggerEvent(input, state, value){

        if(!state.value || state.value < input.state) {  //pressing
            adjustThrottle(value);

            if(input.state > 0.99) { //keep using adjust until release event comes
                fxnId = setInterval(() => adjustThrottle(value), 1);
            }
        } else{   
            clearInterval(fxnId);
        }

        state.value = input.state;
    }

    function adjustThrottle(direction) {
        let currentThrottle = Number($('#throttle-value').html());

        currentThrottle += Math.sign(direction);
        currentThrottle = (currentThrottle > 0 ? Math.min(currentThrottle, 255) : Math.max(currentThrottle, -255) );

        $('#throttle-value').html(currentThrottle);
        $('#direction-value').html(Math.sign(currentThrottle) > 0 ? "FORWARD" : "BACKWARD");

        return Math.abs(currentThrottle);
    }

    function adjustSteer(controllerX, controllerY) {
        let currentSteer = Number($('#steer-value').html());

        const marginTop = scale([-1, 1], [18, -2])(controllerY);
        const marginLeft = steer(controllerX);
    
        controller.rumble(1.0);

        $(".roll_in_in").addClass("active");
    
        $(".roll_in_in").css({
            "margin-top" : marginTop + 'px',
            "margin-left" : marginLeft + 'px'
        });
        
        if(marginTop > 5.5 && marginTop < 8.5 && marginLeft > -1 && marginLeft < 1) {
            $('.roll_in_in').removeClass('active');
        }
        
        if (controllerY < 0.06 && controllerY > -0.06) {
            controller.rumble(0);
        }  

        currentSteer = Math.floor(controllerX * 100);

        $('#steer-value').html(currentSteer);

        return currentSteer;
    }
}

if(document.readyState === "complete"){
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
