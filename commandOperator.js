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

        setInterval(
            () => this._launchCommandSeeding(),
            intervalBetweenCallsInMS,
        );
    }

    blink() {
        console.log(`Blink`);
        commandController.blink().then(() => commandController.launchTransmission);
    }

    look() {
        return commandController.look();
    }

    ping() {
        return commandController.ping();
    }

    stop() {
        return commandController.stop();
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

    _launchCommandSeeding() {
        const steerToSend = this.newSteer;
        const engineStateToSend = this.newEngineState;
        const throttleToSend = this.newThrottle;

        const sendedCommands = [];

        const steerUpdate = this.previousSteer !== steerToSend;
        const previousEngineStateUpdate = this.previousEngineState !== engineStateToSend;
        const throttleUpdate = this.previousThrottle !== throttleToSend;
        if (steerUpdate && previousEngineStateUpdate && throttleUpdate) {
            if (previousEngineStateUpdate) {
                console.log(`Update the engineState [previous=${this.previousEngineState}, new=${engineStateToSend}`);
                if (this.engineStateToSend === "STOP") {
                    sendedCommands.push(commandController.stop());
                } else if (engineStateToSend === "FORWARD") {
                    sendedCommands.push(commandController.forward());
                } else if (engineStateToSend === "BACKWARD") {
                    sendedCommands.push(commandController.backward());
                }
                this.previousEngineState = engineStateToSend
            }
            if (steerUpdate) {
                console.log(`Update the steer [previous=${this.previousSteer}, new=${steerToSend}`);
                sendedCommands.push(commandController.steer(steerToSend));
                this.previousSteer = steerToSend
            }
            if (throttleUpdate) {
                console.log(`Update the throttle [previous=${this.previousThrottle}, new=${throttleToSend}`);
                sendedCommands.push(commandController.throttle(throttleToSend));
                this.previousThrottle = throttleToSend
            }

            Promise.all(sendedCommands).then(() => {
                console.log(`Launch transmission`);
                commandController.launchTransmission()
            })
        }
    }
}

export {CommandOperator}
