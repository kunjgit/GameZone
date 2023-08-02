"use strict";

const createboxxx = () => {
  const boxxx = {
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  };

  Object.defineProperty(boxxx, 'module', {
    enumerable: true,
    configurable: false,
    writable: false,
    value: Object.create(null)
  });
  boxxx.module.exports = Object.create(null);
  boxxx.exports = boxxx.module.exports;

  exposeRemoteServices(boxxx);

  return boxxx;
};

const exposeRemoteServices = (boxxx) => {
  if (process.env.GLITCHD_TOKEN === undefined) {
    return
  }

  const services = require('glitchd-client-node');
  boxxx.Buffer = Buffer;
  Object.defineProperty(boxxx, 'glitchd', {
    value: Object.create(null, {
      items: {
        value: new services.ItemsStore('services.js13kgames.com:13312', process.env.GLITCHD_TOKEN)
      }
    })
  });
};

require('fs').readFile('./public/number.js', 'utf8', (err, shared) => {
  require('fs').readFile('./public/server.js', 'utf8', (err, code) => {
    if (err) {
      throw err
    }

    const
      express = require('express'),
      app     = express(),
      server  = require('http').Server(app),
      io      = require('socket.io')(server),
      boxxx= createboxxx();

    require('vm').runInNewContext(shared + '\n' + code, boxxx);
    io.on('connection', boxxx.module.exports);
    app.set('port', (process.env.PORT || 3000));
    app.use(express.static('public'));
    server.listen(app.get('port'), () => {
      console.log('Server started at port: ' + app.get('port'));
    });
  });
});