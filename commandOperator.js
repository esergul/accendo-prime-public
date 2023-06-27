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

        engineStateUpdated.then(() => {
            const sentCommands = [];

            this._launchSteerCommand(steerToSend, sentCommands);
            this._launchThrottleCommand(throttleToSend, sentCommands);

            if (sentCommands.length !== 0) {
                Promise.all(sentCommands).then(() => {
                    console.log(`Launch steer and throttle transmission`);
                    commandController.launchTransmission()
                })
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

    _launchSteerCommand(steerToSend, commandPromises) {
        const steerUpdate = this.previousSteer !== steerToSend;
        if (steerUpdate) {
            console.log(`Update the steer [previous=${this.previousSteer}, new=${steerToSend}`);
            commandPromises.push(commandController.steer(steerToSend));
            this.previousSteer = steerToSend
        }
    }

    _launchThrottleCommand(throttleToSend, commandPromises) {
        const throttleUpdate = this.previousThrottle !== throttleToSend;
        if (throttleUpdate) {
            console.log(`Update the throttle [previous=${this.previousThrottle}, new=${throttleToSend}`);
            commandPromises.push(commandController.throttle(throttleToSend));
            this.previousThrottle = throttleToSend
        }
    }
}

export {CommandOperator}
