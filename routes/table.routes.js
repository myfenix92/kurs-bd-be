const Routr = require('express');
const router = new Routr();
const TableController = require('../controllers/table.controllers');

router.get('/table/sticker/:id_sticker', TableController.getStickersValue);
router.get('/table/sort/alphabet/:id_sticker', TableController.sortByAlphabet);
router.get('/table/sort/old/:id_sticker', TableController.sortByOld);
router.get('/table/sort/new/:id_sticker', TableController.sortByNew);
router.get('/table/:id_table', TableController.getTable);

router.delete('/table/record/:id_record', TableController.deleteRecord);
router.delete('/table/sticker/:id_sticker', TableController.deleteSticker);
router.delete('/table/:id_table', TableController.deleteTable);

router.post('/table/sticker', TableController.createSticker);
router.post('/table/record', TableController.createRecord);

router.put('/table/record', TableController.changeRecord);
router.put('/table/sticker', TableController.changeNameSticker);
router.put('/table/:id_table', TableController.changeNameTable);
router.put('/table/record/done', TableController.isDone);

module.exports = router;