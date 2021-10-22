const Routr = require('express');
const router = new Routr();
const MainController = require('../controllers/main.controllers');

// 2 post не работают вместе, надо разделять
router.get('/main', MainController.getAllTables);
router.get('/main', MainController.filterByParams);
router.post('/main', MainController.createTable);

module.exports = router;