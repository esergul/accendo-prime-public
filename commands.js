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
        this.rover = await Leanspace.getAsset(this.roverName);
        this.relay = await Leanspace.getAsset(this.relayName);
        this.commandDefinitions = (await Leanspace.getCommandDefinition(teamPrefix + " .*")).data.content;
        this.commandQueue = (await Leanspace.getCommandQueue(teamPrefix + " .*")).data.content[0];
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
}

export{CommandController}

