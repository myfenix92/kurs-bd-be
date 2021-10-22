const db = require('../db');

class MainController {

  async getAllTables(req, res) {
    const { id_user } = req.body;
    const getTableQuery = await db.query(`
    select id_table, name_table, date_create, (select kurs.count_record(id_table)) as count_records \n
    from kurs.user_tables, kurs.users \n
    where kurs.users.id_user = kurs.user_tables.id_user \n
    and kurs.users.id_user = ($1) \n
	  group by id_table \n
	  order by date_create desc`, [id_user]);
    res.json(getTableQuery.rows)
  }

  async createTable(req, res) {
    const { id_user, nameTable } = req.body;
    const newTable = await db.query(`
    insert into kurs.user_tables (id_user, name_table, date_create, count_records) values ($1, $2, now(), 0)`, [id_user, nameTable]);
    res.json(newTable.rows[0])
  }

  async filterByParams(req, res) {
    let queryString;
    let getFilterByNameQuery;
    const { nameTable, dateFrom, dateTo } = req.query;
    const { id_user } = req.body;
    //name+ from- to-
    if (nameTable !== '' && dateFrom === '' && dateTo === '') {
      queryString = `
      select name_table, date_create, count_records \n
      from kurs.user_tables, kurs.users \n
      where kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      and upper(name_table) like upper($2)
      order by date_create desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user, `%${nameTable}%`]);
      //name+ from+ to-
    } else if (nameTable !== '' && dateFrom !== '' && dateTo === '') {
      queryString = `
      select name_table, date_create, count_records \n
      from kurs.user_tables, kurs.users \n
      where kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      and upper(name_table) like upper($2)
      and date_create >= ($3)
      order by date_create desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user, `%${nameTable}%`, dateFrom]);
      //name+ from+ to+
    } else if (nameTable !== '' && dateFrom !== '' && dateTo !== '') {
      queryString = `
      select name_table, date_create, count_records \n
      from kurs.user_tables, kurs.users \n
      where kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      and upper(name_table) like upper($2)
      and (date_create >= ($3) and date_create <= ($4))
      order by date_create desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user, `%${nameTable}%`, dateFrom, dateTo]);
      //name+ from- to+
    } else if (nameTable !== '' && dateFrom === '' && dateTo !== '') {
      queryString = `
      select name_table, date_create, count_records \n
      from kurs.user_tables, kurs.users \n
      where kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      and upper(name_table) like upper($2)
      and date_create <= ($3)
      order by date_create desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user, `%${nameTable}%`, dateTo]);
      //name- from+ to-
    } else if (nameTable === '' && dateFrom !== '' && dateTo === '') {
      queryString = `
      select name_table, date_create, count_records \n
      from kurs.user_tables, kurs.users \n
      where kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      and date_create >= ($2)
      order by date_create desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user, dateFrom]);
      //name- from- to+
    } else if (nameTable === '' && dateFrom === '' && dateTo !== '') {
      queryString = `
      select name_table, date_create, count_records \n
      from kurs.user_tables, kurs.users \n
      where kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      and date_create <= ($2)
      order by date_create desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user, dateTo]);
      //name- from+ to+
    } else if (nameTable === '' && dateFrom !== '' && dateTo !== '') {
      queryString = `
      select name_table, date_create, count_records \n
      from kurs.user_tables, kurs.users \n
      where kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      and (date_create >= ($2) and date_create <= ($3))
      order by date_create desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user, dateFrom, dateTo]);
      //name- from- to-
    } else if (nameTable === '' && dateFrom === '' && dateTo === '') {
      queryString = `
      select name_table, date_create, count_records \n
      from kurs.user_tables, kurs.users \n
      where kurs.users.id_user = kurs.user_tables.id_user \n
      and kurs.users.id_user = ($1) \n
      order by date_create desc;`
      getFilterByNameQuery = await db.query(queryString, [id_user]);
    }
    res.json(getFilterByNameQuery.rows)
  }

  async getAvgCountTables(req, res) {
    const getAvgQuery = await db.query(`
    select count(distinct(kurs.user_tables.id_table)) / count(distinct(kurs.users.id_user))::numeric as avg_tab \n
    from kurs.user_tables, kurs.users`);
    res.json(getAvgQuery.rows);
  }

  async getPercentTables(req, res) {
    const { id_user } = req.body;
    const getPercentQuery = await db.query(`
    select (count(distinct(kurs.user_tables.id_table)) * 100) / (select count(kurs.user_tables.id_table) \n
    from kurs.user_tables) as percent_tab \n
    from kurs.user_tables, kurs.users \n
    where kurs.user_tables.id_user = ($1) \n
    and kurs.user_tables.id_user = kurs.users.id_user`, [id_user]);
    res.json(getPercentQuery.rows)
  }
};

module.exports = new MainController();