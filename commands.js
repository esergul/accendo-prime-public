import * as Leanspace from "./ls.js"

const roverName = "Roveo";
const relayName = "Relayet";
const teamPrefix = "FlatEarth"

class CommandController{

    roverName;
    relayName;
    rover;
    relay;
    commandDefinitions;
    commandQueue;

    constructor(roverName, relayName){
        this.roverName = roverName;
        this.relayName = relayName;
    }

    async loadParams(){
        let self = this;

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
        }).then((resp) => console.log(resp));
    }
}

let cmdController = new CommandController(roverName, relayName);
await cmdController.loadParams();

console.log(cmdController)
cmdController.blink()

