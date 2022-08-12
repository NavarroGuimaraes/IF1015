const express = require('express');
const personController = require('../controller/personController')

const routes = express.Router();

routes.get('/person', personController.listAll)
routes.get('/person/:personId', personController.listOne)
routes.post('/person', personController.createPerson)
routes.put('/person/:personId', personController.updatePerson)
routes.delete('/person/:personId', personController.deletePerson)

module.exports = routes;