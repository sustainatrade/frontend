const nanoid = require('nanoid');
const { echo, asyncExec, cat, mv, test } = require('async-shelljs');
// const fs = require('fs');
const path = require('path');

const swConfig = {
  version: nanoid()
};

process.env['NODE_ENV'] = 'production';
process.env['NODE_PATH'] = './src';
process.env['REACT_APP_RAND_HASH'] = swConfig.version;

echo(JSON.stringify(swConfig)).to('server/sw-config.json');

const overrideJS = `./.config-overrides.js`;

const REACT_SCRIPTS_CONFIG_DIR = 'node_modules/react-scripts/config/';
const CONFIG_FILE_NAME = path.join(REACT_SCRIPTS_CONFIG_DIR, 'webpack.config.js');
const CONFIG_FILE_NAME_TMP = path.join(REACT_SCRIPTS_CONFIG_DIR, 'webpack.config.default.js');

// echo(overrideJS).toEnd('node_modules/react-scripts/config/webpack.config.js');
if(!test('-f', CONFIG_FILE_NAME_TMP)){
  mv(CONFIG_FILE_NAME, CONFIG_FILE_NAME_TMP);
}
if(test('-f', CONFIG_FILE_NAME_TMP)){
  cat(overrideJS).to(CONFIG_FILE_NAME);
}

require('react-scripts/scripts/build');
// asyncExec('cross-env NODE_PATH=./src react-scripts build').then(() => {
//   console.log('---injecting .sw-inject.js');
//   cat('.sw-inject.js').toEnd('build/service-worker.js');
//   console.log('---done injecting');
// });
