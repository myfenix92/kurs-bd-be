const Routr = require('express');
const router = new Routr();
const TableController = require('../controllers/table.controllers');
const authMiddleware = require('../middlewaree/authMiddleware')

router.get('/table/sticker/:id_sticker', authMiddleware, TableController.getStickersValue);
router.get('/table/sort/alphabet/:id_sticker', authMiddleware, TableController.sortByAlphabet);
router.get('/table/sort/old/:id_sticker', authMiddleware, TableController.sortByOld);
router.get('/table/sort/new/:id_sticker', authMiddleware, TableController.sortByNew);
router.get('/table/history/:id_table', authMiddleware, TableController.getHistoryTable);
router.get('/table/:id_table', authMiddleware, TableController.getTable);
router.get('/table/bg/:id_table', authMiddleware, TableController.getBgTable);

router.delete('/table/sticker/:id_sticker', TableController.deleteSticker);
router.delete('/table/:id_table', TableController.deleteTable);

router.post('/table/sticker', TableController.createSticker);
router.post('/table/record', TableController.createRecord);

router.put('/table/change/record', TableController.changeRecord);
router.put('/table/change/sticker', TableController.changeNameSticker);
router.put('/table/:id_table', TableController.changeNameTable);
router.put('/table/bg/:id_table', TableController.changeBgTable);
router.put('/table/record/done', TableController.isDone);

module.exports = router;