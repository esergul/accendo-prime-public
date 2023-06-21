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

    if(marginTop > 5.5 && marginTop < 8.5 && marginLeft > -1 && marginLeft < 1) {
        $('.roll_in_in').removeClass('active');
    }

    commandOperator.updateSteer(controllerX * 100);

    if (controllerY === 0) {
        commandOperator.updateEngineState("STOP");
    } else if (controllerY > 0) {
        commandOperator.updateEngineState("FORWARD");
    } else if (controllerY < 0) {
        commandOperator.updateEngineState("BACKWARD");
    }

    if (controllerY > 0) {
        commandOperator.updateThrottle(controllerY * 256)
    } else if (controllerY < 0) {
        commandOperator.updateThrottle(-controllerY * 256)
    }
}

function init() {
    controller.connection.on("change", ({ active }) => {
        $("#indicator-led").toggleClass("led-red led-green")
        $("#indicator-text").html(`${active ? '' : 'dis'}connected`);
    });

    controller.left.analog.on("change", ({ x, y }) => {
        throttle(x, y);
    });

    controller.triangle.on("change", (input) => {
        $(".triangle").toggleClass("activeButton", input.active);
        if(input.active) {
            //todo: Ping command
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
            //todo: LOOK command
        }
    });

    controller.circle.on("change", (input) => {
        $(".rond").toggleClass("activeButton", input.active)
        if(input.active) {
            //todo: Blink command
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
}

if(document.readyState === "complete"){
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
