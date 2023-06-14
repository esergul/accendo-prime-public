import * as Leanspace from "./ls.js"

const defaultRoverName = "Roveo";
const defaultRelayName = "Relayet";
const teamPrefix = "FlatEarth"

class CommandController {

    roverName;
    relayName;
    rover;
    relay;
    commandDefinitions;
    commandQueue;

    constructor(roverName = defaultRoverName, relayName = defaultRelayName) {
        this.roverName = roverName;
        this.relayName = relayName;
    }

    async loadParams() {
        this.rover = await Leanspace.findAsset(this.roverName);
        this.relay = await Leanspace.findAsset(this.relayName);
        this.commandDefinitions = (await Leanspace.findCommandDefinition(teamPrefix + " .*")).data.content;
        this.commandQueue = (await Leanspace.findCommandQueue(teamPrefix + " .*")).data.content[0];
    }

    async blink() {
        return this._sendCommand("BLINK");
    }

    /**
     * @param value Between 0 and 256
     */
    async throttle(value) {
        return this._sendCommandWithArgument("THROTTLE", value);
    }

    /**
     * @param value Between -100 (Left) and 100 (Right)
     */
    async steer(value) {
        return this._sendCommandWithArgument("STEER", value);
    }

    async forward() {
        return this._sendCommand("FORWARD");
    }

    async backward() {
        return this._sendCommand("BACKWARD");
    }

    async stop() {
        return this._sendCommand("STOP");
    }

    /**
     * @param value Between -100 (Left) and 100 (Right)
     */
    async look(value) {
        return this._sendCommandWithArgument("LOOK", value);
    }

    async ping() {
        return this._sendCommand("PING");
    }

    async _sendCommand(identifier) {
        const commandDefinition = this.commandDefinitions.find((def) => def.identifier.includes(identifier));

        Leanspace.createCommand({
            "commandQueueId": this.commandQueue.id,
            "commandDefinitionId": commandDefinition.id,
        }).then((resp) => {
            if (resp.status === 200) {
                Leanspace.createTransmission({
                    "commandQueueId": this.commandQueue.id,
                    "groundStationId": this.relay.id,
                }).then((resp) => console.log(resp))
            }
        });
    }

    async _sendCommandWithArgument(identifier, value) {
        const commandDefinitionId = this.commandDefinitions.find((def) => def.identifier.includes(identifier)).id;
        const commandDefinitionWithArguments = await Leanspace.getCommandDefinition(commandDefinitionId);
        const commandDefinitionArgument = commandDefinitionWithArguments.data.arguments[0];

        Leanspace.createCommand({
            "commandQueueId": this.commandQueue.id,
            "commandDefinitionId": commandDefinitionId,
            "commandArguments": [
                {
                    "appliedArgumentId": commandDefinitionArgument.id,
                    "attributes": {
                        "type": commandDefinitionArgument.attributes.type,
                        "value": value,
                    },
                },
            ],
        }).then((resp) => {
            if (resp?.status === 200) {
                Leanspace.createTransmission({
                    "commandQueueId": this.commandQueue.id,
                    "groundStationId": this.relay.id,
                }).then((resp) => console.log(resp))
            } else {
                console.warn("Could not create command!")
            }
        })
    }
}

export {CommandController}

