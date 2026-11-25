const { createApp } = require('./app');

const port = process.env.PORT || 3000;

createApp().listen(port, () => {
  console.log(`Sistema de ventas escuchando en http://localhost:${port}`);
});
