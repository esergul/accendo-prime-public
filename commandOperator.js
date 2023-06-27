import {CommandController} from "./commands.js"

const commandController = new CommandController();
await commandController.loadParams();

const intervalBetweenCallsInMS = 1000;

class CommandOperator {

    previousSteer;
    newSteer;
    previousEngineState;
    newEngineState;
    previousThrottle;
    newThrottle;

    constructor() {
        this.previousSteer = this.newSteer = 0;
        this.previousEngineState = this.newEngineState = 'STOP';
        this.previousThrottle = this.newThrottle = 0;
    }

    blink() {
        console.log(`Blink`);
        commandController.blink().then(() => commandController.launchTransmission());
    }

    look() {
        return commandController.look();
    }

    ping() {
        return commandController.ping().then(() => commandController.launchTransmission());;
    }

    stop() {
        return commandController.stop();
    }

    stopAndClear() {
        this.newSteer = 0;
        this.newEngineState = "STOP";
        this.newThrottle = 0;
        this.launchCommandSeeding();
    }

    /**
     * @param {number} value Turn the front wheels. Between -100 (left) and 100 (right).
     */
    updateSteer(value) {
        this.newSteer = value;
    }

    /**
     * @param {('STOP'|'FORWARD'|'BACKWARD')} value Set the engine state
     */
    updateEngineState(value) {
        this.newEngineState = value;
    }

    /**
     * @param {number} value Set the engine power. Between 0 (stop) and 256 (full power)
     */
    updateThrottle(value) {
        this.newThrottle = value;
    }

    launchCommandSeeding() {
        const steerToSend = this.newSteer;
        const engineStateToSend = this.newEngineState;
        const throttleToSend = this.newThrottle;

        const engineStateUpdated = this.previousEngineState !== engineStateToSend
            ? this._launchEngineStateCommand(engineStateToSend)
            : Promise.resolve();

        const throttleUpdate = this.previousThrottle !== throttleToSend;
        const steerUpdate = this.previousSteer !== steerToSend;

        engineStateUpdated.then(async () => {
            if (throttleUpdate && steerUpdate) {
                this._launchSteerCommand(steerToSend)
                    .then(async () => {
                        this._launchThrottleCommand(throttleToSend)
                    });
            } else if (throttleUpdate) {
                this._launchThrottleCommand(throttleToSend);
            } else if (steerUpdate) {
                this._launchSteerCommand(steerToSend);
            }
        })
    }

    _launchEngineStateCommand(engineStateToSend) {
        console.log(`Update the engineState [previous=${this.previousEngineState}, new=${engineStateToSend}`);

        let commandPromise = null;
        if (engineStateToSend === "STOP") {
            commandPromise = commandController.stop();
        } else if (engineStateToSend === "FORWARD") {
            commandPromise = commandController.forward();
        } else if (engineStateToSend === "BACKWARD") {
            commandPromise = commandController.backward();
        }

        this.previousEngineState = engineStateToSend;

        return commandPromise.then(() => {
            console.log(`Launch engine state update transmission`);
            return commandController.launchTransmission()
        });
    }

    _launchSteerCommand(steerToSend) {
        console.log(`Update the steer [previous=${this.previousSteer}, new=${steerToSend}`);

        const commandPromise = commandController.steer(steerToSend);
        this.previousSteer = steerToSend

        return commandPromise.then(() => {
            console.log(`Launch steer update transmission`);
            return commandController.launchTransmission()
        });
    }

    _launchThrottleCommand(throttleToSend) {
        console.log(`Update the throttle [previous=${this.previousThrottle}, new=${throttleToSend}`);

        const commandPromise = commandController.throttle(throttleToSend);
        this.previousThrottle = throttleToSend;

        return commandPromise.then(() => {
            console.log(`Launch steer update transmission`);
            return commandController.launchTransmission()
        });
    }
}

export {CommandOperator}
