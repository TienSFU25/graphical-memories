///<reference path="../node_modules/@types/node/index.d.ts" />

import * as express from 'express';
import * as webpack from 'webpack';
import { resolve } from 'path';
import config from '../webpack.config';
import * as open from 'open';
import * as webpackDev from 'webpack-dev-middleware';
import * as webpackHot from 'webpack-hot-middleware';

/* eslint-disable no-console */

const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(webpackDev(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(webpackHot(compiler));

app.get('*', function(req, res) {
  res.sendFile(resolve(__dirname, '../../src/index.html'));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
});

console.log(`shit happening on port ${port}`);
