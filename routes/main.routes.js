const Routr = require('express');
const router = new Routr();
const MainController = require('../controllers/main.controllers');
const authMiddleware = require('../middlewaree/authMiddleware')

router.get('/main/tables/:id_user', authMiddleware, MainController.getAllTables);
router.get('/main/numeric/:id_user', authMiddleware, MainController.getNumericData);
router.get('/main/filter/:id_user', MainController.filterByParams);

router.post('/main', MainController.createTable);

module.exports = router;