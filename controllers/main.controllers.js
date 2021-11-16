const db = require('../db');

class MainController {

  async getAllTables(req, res) {
    const { id_user } = req.params;
    const getTableQuery = await db.query(`
    select kurs.user_tables.id_table, name_table, date_change::timestamp at time zone 'Etc/Greenwich' as date_create, \n
    (select kurs.count_record(kurs.user_tables.id_table)) as count_records \n
    from kurs.users, kurs.user_tables \n
    join kurs.history_changes on kurs.history_changes.id_table = kurs.user_tables.id_table \n
    where kurs.history_changes.changes = 'создали доску' \n
    and kurs.users.id_user = kurs.user_tables.id_user \n
    and kurs.users.id_user = ($1)
    order by id_table desc;`, [id_user]);
    res.json(getTableQuery.rows)
  }

  async createTable(req, res) {
    try {
      const { id_user, nameTable } = req.body;
      const newTable = await db.query(`
      insert into kurs.user_tables (id_user, name_table) values ($1, $2)`, [id_user, nameTable]);
      res.json(newTable.rows)
    } catch(error) {
      res.json({
        errorMessage: error.message,
      })
    }

  }

  async filterByParams(req, res) {
    let queryString;
    let getFilterByNameQuery;
    const { nameTable, dateFrom, dateTo } = req.query;
    const { id_user } = req.params;
    //name+ from- to-
    if (nameTable !== '' && dateFrom === '' && dateTo === '') {
      queryString = `
      select kurs.user_tables.id_table, name_table, date_change::timestamp at time zone 'Etc/Greenwich' as date_create, \n
      (select kurs.count_record(kurs.user_tables.id_table)) as count_records \n
      from kurs.users, kurs.user_tables \n
      join kurs.history_changes on kurs.history_changes.id_table = kurs.user_tables.id_table \n
      where kurs.history_changes.changes = 'создали доску' \n
      and kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      and upper(name_table) like upper($2)
      order by id_table desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user, `%${nameTable}%`]);
      //name+ from+ to-
    } else if (nameTable !== '' && dateFrom !== '' && dateTo === '') {
      queryString = `
      select kurs.user_tables.id_table, name_table, date_change::timestamp at time zone 'Etc/Greenwich' as date_create, \n
      (select kurs.count_record(kurs.user_tables.id_table)) as count_records \n
      from kurs.users, kurs.user_tables \n
      join kurs.history_changes on kurs.history_changes.id_table = kurs.user_tables.id_table \n
      where kurs.history_changes.changes = 'создали доску' \n
      and kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      and upper(name_table) like upper($2)
      and date_change >= ($3)
      order by id_table desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user, `%${nameTable}%`, dateFrom]);
      //name+ from+ to+
    } else if (nameTable !== '' && dateFrom !== '' && dateTo !== '') {
      queryString = `
      select kurs.user_tables.id_table, name_table, date_change::timestamp at time zone 'Etc/Greenwich' as date_create, \n
      (select kurs.count_record(kurs.user_tables.id_table)) as count_records \n
      from kurs.users, kurs.user_tables \n
      join kurs.history_changes on kurs.history_changes.id_table = kurs.user_tables.id_table \n
      where kurs.history_changes.changes = 'создали доску' \n
      and kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      and upper(name_table) like upper($2)
      and (date_change >= ($3) and date_change <= ($4))
      order by id_table desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user, `%${nameTable}%`, dateFrom, dateTo]);
      //name+ from- to+
    } else if (nameTable !== '' && dateFrom === '' && dateTo !== '') {
      queryString = `
      select kurs.user_tables.id_table, name_table, date_change::timestamp at time zone 'Etc/Greenwich' as date_create, \n
      (select kurs.count_record(kurs.user_tables.id_table)) as count_records \n
      from kurs.users, kurs.user_tables \n
      join kurs.history_changes on kurs.history_changes.id_table = kurs.user_tables.id_table \n
      where kurs.history_changes.changes = 'создали доску' \n
      and kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      and upper(name_table) like upper($2)
      and date_change <= ($3)
      order by id_table desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user, `%${nameTable}%`, dateTo]);
      //name- from+ to-
    } else if (nameTable === '' && dateFrom !== '' && dateTo === '') {
      queryString = `
      select kurs.user_tables.id_table, name_table, date_change::timestamp at time zone 'Etc/Greenwich' as date_create, \n
      (select kurs.count_record(kurs.user_tables.id_table)) as count_records \n
      from kurs.users, kurs.user_tables \n
      join kurs.history_changes on kurs.history_changes.id_table = kurs.user_tables.id_table \n
      where kurs.history_changes.changes = 'создали доску' \n
      and kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      and date_change >= ($2)
      order by id_table desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user, dateFrom]);
      //name- from- to+
    } else if (nameTable === '' && dateFrom === '' && dateTo !== '') {
      queryString = `
      select kurs.user_tables.id_table, name_table, date_change::timestamp at time zone 'Etc/Greenwich' as date_create, \n
      (select kurs.count_record(kurs.user_tables.id_table)) as count_records \n
      from kurs.users, kurs.user_tables \n
      join kurs.history_changes on kurs.history_changes.id_table = kurs.user_tables.id_table \n
      where kurs.history_changes.changes = 'создали доску' \n
      and kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      and date_change <= ($2)
      order by id_table desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user, dateTo]);
      //name- from+ to+
    } else if (nameTable === '' && dateFrom !== '' && dateTo !== '') {
      queryString = `
      select kurs.user_tables.id_table, name_table, date_change::timestamp at time zone 'Etc/Greenwich' as date_create, \n
      (select kurs.count_record(kurs.user_tables.id_table)) as count_records \n
      from kurs.users, kurs.user_tables \n
      join kurs.history_changes on kurs.history_changes.id_table = kurs.user_tables.id_table \n
      where kurs.history_changes.changes = 'создали доску' \n
      and kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      and (date_change >= ($2) and date_change <= ($3))
      order by id_table desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user, dateFrom, dateTo]);
      //name- from- to-
    } else if (nameTable === '' && dateFrom === '' && dateTo === '') {
      queryString = `
      select kurs.user_tables.id_table, name_table, date_change::timestamp at time zone 'Etc/Greenwich' as date_create, \n
      (select kurs.count_record(kurs.user_tables.id_table)) as count_records \n
      from kurs.users, kurs.user_tables \n
      join kurs.history_changes on kurs.history_changes.id_table = kurs.user_tables.id_table \n
      where kurs.history_changes.changes = 'создали доску' \n
      and kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      order by id_table desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user]);
    }
    res.json(getFilterByNameQuery.rows)
  }

  async getNumericData(req, res) {
    const { id_user } = req.params;
    const getNumericQuery = await db.query(`
    select (count(distinct(kurs.user_tables.id_table)) * 100) / (select count(kurs.user_tables.id_table) \n
    from kurs.user_tables) as percent_tab, \n
    (select count(distinct(kurs.user_tables.id_table)) / count(distinct(kurs.users.id_user))::numeric \n
    from kurs.user_tables, kurs.users) as avg_tab \n
    from kurs.user_tables, kurs.users \n
    where kurs.user_tables.id_user = ($1) \n
    and kurs.user_tables.id_user = kurs.users.id_user`, [id_user]);
    res.json(getNumericQuery.rows)
  }
};

module.exports = new MainController();