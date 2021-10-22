const Routr = require('express');
const router = new Routr();
const MainController = require('../controllers/main.controllers');

router.get('/main/all_tables', MainController.getAllTables);
router.get('/main/percent', MainController.getPercentTables);
router.get('/main/avg', MainController.getAvgCountTables);
router.get('/main', MainController.filterByParams);

router.post('/main', MainController.createTable);

module.exports = router;