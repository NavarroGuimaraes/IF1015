const express = require('express');
const routes = require('./api/routes/router');
const config  = require('config');
//const bodyParser = require('body-parser');
const server = express();

server.use(express.json());
server.use(routes);

const port = process.env.PORT || config.get('server.port');

server.listen(port, () => {
  console.log(`IHAAA o servidor subiu na porta ${port} 🚀`)
});
