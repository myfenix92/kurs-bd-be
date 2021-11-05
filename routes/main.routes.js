const Routr = require('express');
const router = new Routr();
const MainController = require('../controllers/main.controllers');

router.get('/main/tables/:id_user', MainController.getAllTables);
router.get('/main/numeric/:id_user', MainController.getNumericData);
router.get('/main/filter/:id_user', MainController.filterByParams);

router.post('/main', MainController.createTable);

module.exports = router;