import * as Leanspace from "./ls.js"

const defaultRoverName = "Roveo";
const defaultRelayName = "Relayet";
const teamPrefix = "FlatEarth"

class CommandController{

    roverName;
    relayName;
    rover;
    relay;
    commandDefinitions;
    commandQueue;

    constructor(roverName = defaultRoverName, relayName = defaultRelayName){
        this.roverName = roverName;
        this.relayName = relayName;
    }

    async loadParams(){
        this.rover = await Leanspace.findAsset(this.roverName);
        this.relay = await Leanspace.findAsset(this.relayName);
        this.commandDefinitions = (await Leanspace.findCommandDefinition(teamPrefix + " .*")).data.content;
        this.commandQueue = (await Leanspace.findCommandQueue(teamPrefix + " .*")).data.content[0];
    }

    blink(){
        let blinkCommand = this.commandDefinitions.find((def) => def.identifier.includes("BLINK"));

        Leanspace.createCommand({
            "commandQueueId": this.commandQueue.id,
            "commandDefinitionId": blinkCommand.id
        }).then((resp) => {
            if(resp.status == 200) {
                Leanspace.createTransmission({
                    "commandQueueId": this.commandQueue.id,
                    "groundStationId": this.relay.id
                  }).then((resp) => console.log(resp))
            }
        });
    }

    async throttle(value){
        const throttleCommand = this.commandDefinitions.find((def) => def.identifier.includes("THROTTLE"));
        const commandArg = (await Leanspace.getCommandDefinition(throttleCommand.id)).data.arguments[0];
        console.log(commandArg)
        Leanspace.createCommand({
            "commandQueueId": this.commandQueue.id,
            "commandDefinitionId": throttleCommand.id,
            "commandArguments": [
                {
                  "appliedArgumentId": commandArg.id,
                  "attributes": {
                    "type": commandArg.attributes.type,
                    "value": value
                    }
                }
            ]
        }).then((resp) => {
            if(resp?.status == 200) {
                Leanspace.createTransmission({
                    "commandQueueId": this.commandQueue.id,
                    "groundStationId": this.relay.id
                  }).then((resp) => console.log(resp))
            } else {
                console.warn("Could not create command!")
            }
        })
    }
}

export{CommandController}

