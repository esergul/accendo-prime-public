const {Dualsense} = require('dualsense-ts')
const controller = new Dualsense();

const scale = (fromRange, toRange) => {
    const d = (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0]);
    return from =>  (from - fromRange[0]) * d + toRange[0];
};

function steer(amount) {

    let value = amount * 100;

    const marginLeft = scale([0, 100], [0, 15])(Math.abs(value)) * Math.sign(value); 

    return marginLeft;
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

    //todo: FORWARD or BACKWARD, STEER, THROTTLE commands
    //todo: add a timer to stop the car if the controller is not active

}

function init() {

    controller.connection.on("change", ({ active }) => {
        console.log(`controller ${active ? '' : 'dis'}connected`);  
        //todo: have an indicator on the UI indiating status
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
            //todo: Blink command
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

document.addEventListener("DOMContentLoaded", init);
