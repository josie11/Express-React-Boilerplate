'use strict';
/*
  server.js is a express factory that returns either a development server
  or a production server depending on the environment
*/

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

module.exports = {
  development: function() {
    const webpack = require('webpack');
    const config = require('../webpack.config.js');
    const compiler = webpack(config);
    //This is our development server --> a webpack experss server
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler));

    app.use(bodyParser.json());
    app.use('/api', routes);

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../src/index.html'));
    });

    return app;
  },
  production: function() {
    // serve our static stuff like index.css
    app.use(express.static(__dirname));

    // below serves gzipped version of bundle.js for production
    app.get('*.js', function (req, res, next) {
      req.url = req.url + '.gz';
      res.set('Content-Encoding', 'gzip');
      next();
    });

    app.use(bodyParser.json());
    app.use('/api', routes);

    app.get('*', function (req, res) {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });

    return app;
  }
};
