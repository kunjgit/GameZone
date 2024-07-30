const { format } = require('url');
const { networkInterfaces } = require('os');

const hostname = 'localhost';
const port = process.env.PORT || 8080;

function isLAN(obj) {
	return obj.family === 'IPv4' && !obj.internal;
}

module.exports = function (opts) {
	opts = Object.assign({ hostname, port, https:false }, opts);
	opts.protocol = opts.https ? 'https' : 'http';
	let local = format(opts);

	let k, tmp;
	let nets = networkInterfaces();
	for (k in nets) {
		if (tmp=nets[k].find(isLAN)) {
			opts.hostname = tmp.address; // network IP
			break;
		}
	}

	let network = format(opts);
	return { local, network };
}
