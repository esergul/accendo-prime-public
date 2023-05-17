const DualSense = require('node-dualsense/src/DualSense')
const decode = require('node-dualsense/src/decode');

const controller = new DualSense(true);

controller.on('error', (err) => {
	console.log(err);
	controller.cose();
	run = false;
});

let last = null;
controller.on('data', (data) => {
	if (last !== null && last === data) {
		return ;
	}
	last = data;
	console.log(decode(data));
});