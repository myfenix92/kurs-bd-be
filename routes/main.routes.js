const Routr = require('express');
const router = new Routr();
const MainController = require('../controllers/main.controllers');

// 2 post не работают вместе, надо разделять
router.post('/main', MainController.getAllTables);
router.get('/main', MainController.filterByParams);
router.post('/main/create', MainController.createTable);

module.exports = router;