// const nanoid = require('nanoid');
const { echo, asyncExec, cat } = require('async-shelljs');

console.log('---injecting .sw-inject.js');
cat('.sw-inject.js').toEnd('build/service-worker.js');
console.log('---done injecting');
