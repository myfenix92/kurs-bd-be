const db = require('../db');

class TableController {

  async getTable(req, res) {
    const { id_table }  = req.params;
    const getTableQuery = await db.query(`
    select kurs.stickers.id_sticker, name_sticker, kurs.stickers.date_create \n
    from kurs.user_tables, kurs.stickers \n
    where kurs.user_tables.id_table = kurs.stickers.id_table \n
    and kurs.user_tables.id_table = ($1) \n
    order by kurs.stickers.date_create desc`, [id_table]);
    res.json(getTableQuery.rows);
  }

  async getStickersValue(req, res) {
    const { id_sticker } = req.body;
    const getStickerValueQuery = await db.query(`
    select kurs.stickers.id_sticker, id_record, record, kurs.records.date_create \n
    from kurs.stickers, kurs.records \n
    where kurs.stickers.id_sticker = kurs.records.id_sticker \n
    and kurs.stickers.id_sticker = ($1) \n
    order by kurs.records.date_create desc`, [id_sticker]);
    res.json(getStickerValueQuery.rows)
  }

  async deleteRecord(req, res) {
    const { id_record } = req.body;
    const deleteRecordQuery = await db.query(`
    delete from kurs.records where id_record = ($1)`, [id_record]);
    res.json(deleteRecordQuery.rows[0]);
  }

  async deleteSticker(req, res) {
    const { id_sticker } = req.body;
    const deleteStickerQuery = await db.query(`
    delete from kurs.stickers where id_sticker = ($1)`, [id_sticker]);
    res.json(deleteStickerQuery.rows[0]);
  }

  async deleteTable(req, res) {
    const { id_table } = req.params;
    const deleteTableQuery = await db.query(`
    delete from kurs.user_tables where id_table = ($1)`, [id_table]);
    res.json(deleteTableQuery.rows[0]);
  }

  async createSticker(req, res) {
    const { id_table, name_sticker } = req.body;
    const createStickerQuery = await db.query(`
    insert into kurs.stickers (id_table, name_sticker, date_create) values ($1, $2, now())`, [id_table, name_sticker]);
    res.json(createStickerQuery.rows[0]);
  }

  async createRecord(req, res) {
    const { id_sticker, record } = req.body;
    const createRecordQuery = await db.query(`
    insert into kurs.records (id_sticker, record, date_create) values ($1, $2, now())`, [id_sticker, record]);
    res.json(createRecordQuery.rows[0]);
  }
  
  async changeNameTable(req, res) {
    const { id_table } = req.params;
    const { new_name_table } = req.body;
    const changeTableNameQuery = await db.query(`
      update kurs.user_tables set name_table = ($1) where id_table = ($2) returning *`, [new_name_table, id_table]);
    res.json(changeTableNameQuery.rows[0]);
  }

  async changeNameSticker(req, res) {
    const { id_sticker, new_name_sticker } = req.body;
    const changeTableStickerQuery = await db.query(`
      update kurs.stickers set name_sticker = ($1) where id_sticker = ($2) returning *`, [new_name_sticker, id_sticker]);
    res.json(changeTableStickerQuery.rows[0]);
  }

  async changeRecord(req, res) {
    const { id_record, new_record } = req.body;
    const changeRecordQuery = await db.query(`
    update kurs.records set record = ($1) where id_record = ($2) returning *`, [new_record, id_record]);
    res.json(changeRecordQuery.rows[0]);
  }

  async sortByAlphabet(req, res) {
    const { id_sticker } = req.body
    const sortByAlphabetQuery = await db.query(`
    select record from kurs.records, kurs.stickers \n
    where kurs.records.id_sticker = kurs.stickers.id_sticker \n
    and kurs.stickers.id_sticker = ($1) \n
    order by record`, [id_sticker]);
    res.json(sortByAlphabetQuery.rows);
  }

  async sortByOld(req, res) {
    const { id_sticker } = req.body
    const sortByAlphabetQuery = await db.query(`
    select record from kurs.records, kurs.stickers
    where kurs.records.id_sticker = kurs.stickers.id_sticker
    and kurs.stickers.id_sticker = ($1)
    order by kurs.records.date_create`, [id_sticker]);
    res.json(sortByAlphabetQuery.rows)
  }

  async sortByNew(req, res) {
    const { id_sticker } = req.body
    const sortByAlphabetQuery = await db.query(`
    select record from kurs.records, kurs.stickers
    where kurs.records.id_sticker = kurs.stickers.id_sticker
    and kurs.stickers.id_sticker = ($1)
    order by kurs.records.date_create desc`, [id_sticker]);
    res.json(sortByAlphabetQuery.rows)
  }
};

module.exports = new TableController();