const db = require('../db');

class TableController {

  async getTable(req, res) {
    const { id_table }  = req.params;
    const getTableQuery = await db.query(`
    select kurs.stickers.id_sticker, name_sticker \n
    from kurs.user_tables, kurs.stickers \n
    where kurs.user_tables.id_table = kurs.stickers.id_table \n
    and kurs.user_tables.id_table = ($1) \n
    order by id_sticker desc`, [id_table]);
    res.json(getTableQuery.rows);
  }

  async getStickersValue(req, res) {
    const { id_sticker } = req.params;
    const getStickerValueQuery = await db.query(`
    select kurs.stickers.id_sticker, kurs.records.id_record, record, done  \n
    from kurs.stickers, kurs.records \n
    where kurs.stickers.id_sticker = kurs.records.id_sticker \n
    and kurs.stickers.id_sticker = ($1) \n
    order by id_record`, [id_sticker]);
    res.json(getStickerValueQuery.rows)
  }

  async deleteSticker(req, res) {
    const { id_sticker } = req.params;
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
    insert into kurs.stickers (id_table, name_sticker) values ($1, $2)`, [id_table, name_sticker]);
    res.json(createStickerQuery.rows[0]);
  }

  async createRecord(req, res) {
    const { id_sticker, record } = req.body;
    const createRecordQuery = await db.query(`
    insert into kurs.records (id_sticker, record) values ($1, $2)`, [id_sticker, record]);
    res.json(createRecordQuery.rows[0]);
  }
  
  async changeNameTable(req, res) {
    //const { id_table } = req.params;
    const { id_table, new_name_table } = req.body;
    try {
      const changeTableNameQuery = await db.query(`
      update kurs.user_tables set name_table = ($1) where id_table = ($2)  returning *`, [new_name_table, id_table]);
      res.json(changeTableNameQuery.rows[0]);
    } catch(error) {
      res.json({
        code: error.code,
        message: error.message
      })
    }
  }

  async changeNameSticker(req, res) {
    const { id_sticker, new_name_sticker } = req.body;
    const changeTableStickerQuery = await db.query(`
      update kurs.stickers set name_sticker = ($1) where id_sticker = ($2)`, [new_name_sticker, id_sticker]);
    res.json(changeTableStickerQuery.rows[0]);
  }

  async changeRecord(req, res) {
    const { id_record, new_record } = req.body;
    const changeRecordQuery = await db.query(`
    update kurs.records set record = ($1) where id_record = ($2) returning *`, [new_record, id_record]);
    res.json(changeRecordQuery.rows[0]);
  }

  async sortByAlphabet(req, res) {
    const { id_sticker } = req.params
    const sortByAlphabetQuery = await db.query(`
    select id_record, record, done from kurs.records, kurs.stickers \n
    where kurs.records.id_sticker = kurs.stickers.id_sticker \n
    and kurs.stickers.id_sticker = ($1) \n
    order by record`, [id_sticker]);
    res.json(sortByAlphabetQuery.rows);
  }

  async sortByOld(req, res) {
    const { id_sticker } = req.params
    const sortByAlphabetQuery = await db.query(`
    select * from (select distinct on (kurs.history_changes.id_record) time_change, record, done \n
		from kurs.records, kurs.stickers, kurs.history_changes \n
    where kurs.records.id_sticker = kurs.stickers.id_sticker \n
    and kurs.records.id_record = kurs.history_changes.id_record \n
    and kurs.stickers.id_sticker = ($1) \n
		order by kurs.history_changes.id_record) as time_ch \n
    order by time_ch.time_change`, [id_sticker]);
    res.json(sortByAlphabetQuery.rows)
  }

  async sortByNew(req, res) {
    const { id_sticker } = req.params
    const sortByAlphabetQuery = await db.query(`
    select * from (select distinct on (kurs.history_changes.id_record) time_change, record, done \n
		from kurs.records, kurs.stickers, kurs.history_changes \n
    where kurs.records.id_sticker = kurs.stickers.id_sticker \n
    and kurs.records.id_record = kurs.history_changes.id_record \n
    and kurs.stickers.id_sticker = ($1) \n
		order by kurs.history_changes.id_record) as time_ch \n
    order by time_ch.time_change desc`, [id_sticker]);
    res.json(sortByAlphabetQuery.rows)
  }

  async isDone(req, res) {
    const { id_record } = req.body;
    const isDoneQuery = await db.query(`
    update kurs.records set done = not done where id_record = ($1)`, [id_record]);
    res.json(isDoneQuery.rows)
  }

  async getHistoryTable(req, res) {
    const { id_table } = req.params;
    const historyChangesQuery = await db.query(`
    select id_table, id_sticker, id_record, changes, old_value, time_change, date_change::timestamp at time zone 'Etc/Greenwich' as date_change, \n
    new_tbl, new_stc, new_rec \n
    from kurs.history_changes \n
    where id_table = ($1) or id_sticker in \n
    (select distinct id_sticker from kurs.history_changes \n
    where id_table = ($2)) \n
    order by date_change desc, time_change desc`, [id_table, id_table]);
    res.json(historyChangesQuery.rows)
  }
};

module.exports = new TableController();