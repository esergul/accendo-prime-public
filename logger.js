/* Can be used as
* import {logger} from './logger.js';
* window.console = logger;
*/

class Logger{
    element;

    constructor(el) {
        this.element = el;
    }

    _getTimestamp(){
        let date = new Date();
        return "[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "] ";
    }

    log(text) {
        let block = "<span style='color: white;'>" + this._getTimestamp() + text + "</span><br>";
        this.element.append(block);
    }

    warn(text) {
        let block = "<span style='color: orange;'>" + this._getTimestamp() + text + "</span><br>";
        this.element.append(block);
    }

    error(text) {
        let block = "<span style='color: red;'>" + this._getTimestamp() + text + "</span><br>";
        this.element.append(block);
    }
}

const logger = new Logger($("#log-area"));
export {logger};