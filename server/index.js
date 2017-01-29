'use strict';
const path = require('path');
const Server = require('./server.js');
const env = process.env.NODE_ENV || 'development';

const port = process.env.PORT || 3000;

/*
  server.js is a express factory that returns either a development server
  or a production server depending on the environment
*/
const app = Server[env]();

app.listen(port, function onAppListening(err) {
    if (err) {
        console.error(err);
    } else {
        console.info(`This wonderful ${env} server is running on port ${port}`);
    }
});

