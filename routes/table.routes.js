const Routr = require('express');
const router = new Routr();
const TableController = require('../controllers/table.controllers');

router.get('/table/sticker', TableController.getStickersValue);
router.get('/table/sort/alphabet', TableController.sortByAlphabet);
router.get('/table/sort/old', TableController.sortByOld);
router.get('/table/sort/new', TableController.sortByNew);
router.get('/table/:id_table', TableController.getTable);

router.delete('/table/record/:id_record', TableController.deleteRecord);
router.delete('/table/sticker/:id_sticker', TableController.deleteSticker);
router.delete('/table/:id_table', TableController.deleteTable);

router.post('/table/sticker/:id_table', TableController.createSticker);
router.post('/table/record/:id_sticker', TableController.createRecord);

router.put('/table/record/:id_record', TableController.changeRecord);
router.put('/table/sticker/:id_sticker', TableController.changeNameSticker);
router.put('/table/:id_table', TableController.changeNameTable);

module.exports = router;