const productionConfig = [{}, {
  write: (chunk) => {
    console.log(`${process.env.LOGENTRIES_TOKEN} ${chunk}`);
  },
}];
const devConfig = [{
  prettyPrint: true,
}];
const config = process.env.LOGENTRIES_TOKEN ? productionConfig : devConfig;
const pino = require('pino')(...config);

module.exports = pino;
