const { asyncExec } = require('async-shelljs');
const nanoid = require('nanoid');

( async () => {
  const buildCmd = ` cross-env REACT_APP_RAND_HASH=${nanoid()} react-scripts build`
  await asyncExec(buildCmd);
})()
