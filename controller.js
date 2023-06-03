const {Dualsense} = require('dualsense-ts')
import {CommandController} from "./commands.js"

const controller = new Dualsense();
let cmdController = new CommandController();
await cmdController.loadParams();

let currentEngineState = "STOP"
let throttleInProgress = false

const scale = (fromRange, toRange) => {
    const d = (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0]);
    return from =>  (from - fromRange[0]) * d + toRange[0];
};

function steer(amount) {

    let value = amount * 100;

    const marginLeft = scale([0, 100], [0, 15])(Math.abs(value)) * Math.sign(value);

    return marginLeft;
}

async function throttle(controllerX, controllerY) {
    throttleInProgress = true;

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

    const commandResponses = [];

    commandResponses.push(cmdController.steer(controllerX * 100));

    if (controllerY === 0 && currentEngineState !== "STOP") {
        currentEngineState = "STOP"
        await cmdController.stop();
    } else if (controllerY > 0 && currentEngineState !== "FORWARD") {
        currentEngineState = "FORWARD"
        await cmdController.forward();
    } else if (controllerY < 0 && currentEngineState !== "BACKWARD") {
        currentEngineState = "BACKWARD"
        await cmdController.backward();
    }

    if (controllerY > 0) {
        commandResponses.push(cmdController.throttle(controllerY * 256));
    } else if (controllerY < 0) {
        commandResponses.push(cmdController.throttle(-controllerY * 256));
    }

    Promise.allSettled(commandResponses).then(() => {
        throttleInProgress = false;
    })
}

function init() {

    controller.connection.on("change", ({ active }) => {
        console.log(`controller ${active ? '' : 'dis'}connected`);
        //todo: have an indicator on the UI indiating status
    });

    controller.left.analog.on("change", ({ x, y }) => {
        if (!throttleInProgress) {
            console.log(`Throttle update [x=${x};y=${y}]`)
            throttle(x, y);
        }
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
            cmdController.blink();
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
