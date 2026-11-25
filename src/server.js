const { createApp } = require('./app');
const { loadConfig } = require('./config/loader');

const arg = process.argv.find((a) => a.startsWith('--variant='));
const variant = arg ? arg.split('=')[1] : process.env.VARIANT || 'basica';
const port = process.env.PORT || 3000;

const config = loadConfig(variant);

createApp(config).listen(port, () => {
  console.log(`${config.displayName} escuchando en http://localhost:${port}`);
});
