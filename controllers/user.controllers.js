const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {secret} = require('../config')

const generateAccessToken = (id_user, login, role) => {
    const payload = {
        id_user,
        login,
        role,
    }
    return jwt.sign(payload, secret, {expiresIn: '7d'})
}
class UserController {

    async changeAboutUser(req, res) {
        const {
            id_user,
            password,
            date_birth,
            sex
        } = req.body;
        let addAboutUser;
        let changePassword;
        const hashPassword = bcrypt.hashSync(String(password), 7)
        if (req.body.password !== '' && req.body.date_birth !== '' && req.body.sex !== '') {
            addAboutUser = await db.query(`
            update kurs.about_users set date_birth = ($1)::timestamp at time zone 'Europe/Moscow', 
            sex = ($2)
            where id_user = ($3);`, [date_birth, sex, id_user]);
            changePassword = await db.query(`
            update kurs.users set password = ($1)
            where id_user = ($2);`, [hashPassword, id_user]);
        } else
        if (req.body.password === '' && req.body.date_birth !== '' && req.body.sex !== '') {
            addAboutUser = await db.query(`
            update kurs.about_users set date_birth = ($1)::timestamp at time zone 'Europe/Moscow', 
            sex = ($2)
            where id_user = ($3)`, [date_birth, sex, id_user]);
        }
        //res.json(addAboutUser.rows[0]);
    }

    async userCreate(req, res) {
        const {
            login,
            password,
            date_birth,
            sex
        } = req.body;
        const loginCheckQuery = await db.query(
            `SELECT count(id_user) FROM kurs.users WHERE login = ($1);`, [login]);

        if (+loginCheckQuery.rows[0].count) {
            res.json({
                regStatus: 0,
                regText: 'User alredy exist',
            });
        } else {
            const hashPassword = bcrypt.hashSync(String(password), 7);
            const newUserQuery = await db.query(
                `INSERT INTO kurs.users VALUES ($1, $2) RETURNING *`, [login, hashPassword]);
            res.json({
                regStatus: 1,
                regText: 'Registered',
                id_user: newUserQuery.rows[0].id_user
            });
            const addAboutUser = await db.query(`
            insert into kurs.about_users (id_user, date_birth, sex, date_registr) 
            values ($1, ($2)::timestamp at time zone 'Europe/Moscow', $3, now())`, [newUserQuery.rows[0].id_user, date_birth, sex])
        }
    }

    async userLogin(req, res) {
        const {
            login,
            password
        } = req.body;
        const loginCheck = await db.query(`
            SELECT COUNT(login) from kurs.users WHERE login = ($1);`, [login]);
        if (!(+loginCheck.rows[0].count)) {
            res.json({
                loginStatus: 0,
                loginMessage: 'Wrong login'
            })
        } else {
            const passwordRequest = await db.query(`
                SELECT id_user, password, role from kurs.users WHERE login = ($1);`, [login]);
            const validPassword  = bcrypt.compareSync(String(password), passwordRequest.rows[0].password);
            const token = generateAccessToken(passwordRequest.rows[0].id_user, login, passwordRequest.rows[0].role)
            if (!validPassword) {
                res.json({
                    loginStatus: 0,
                    loginMessage: 'Wrong password'
                })
            } else {
                res.json({
                    loginStatus: 1,
                    loginMessage: 'Login success',
                    loginToken: token,
                    id_user: passwordRequest.rows[0].id_user
                })
            }
            const isOnline = await db.query(`
            UPDATE kurs.users SET online = true WHERE id_user = ($1)`, [passwordRequest.rows[0].id_user]);
        }

    }

    async getUsers(req, res) {
        try {
            const users = await db.query(`
            select kurs.users.id_user, login, sex, date_birth, date_registr, COALESCE(count(id_table), 0) as count_tables, ban::timestamp at time zone 'Etc/Greenwich' as ban
            from kurs.about_users, kurs.users
            left join kurs.user_tables on kurs.user_tables.id_user = kurs.users.id_user
            where kurs.users.id_user = kurs.about_users.id_user and kurs.users.id_user <> 1
            group by kurs.users.id_user, login, sex, date_birth, date_registr
            order by kurs.users.id_user;`)
            const checkBan = await db.query(`update kurs.users set ban = case when ban > now() then ban else null end;`);
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }

    async getCountUsers(req, res) {
        try {
            const countUsers = await db.query(`select count(kurs.users.id_user) - 1 as all_users, 
            (select count(id_user) - 1 from kurs.users where online = true) as online \n
            from kurs.users;`)
            res.json(countUsers);
        }
        catch(e) {
            console.log(e)
        }
    }

    async getMessagesFromUser(req, res) {
        try {
            const msgFromUsers = await db.query(`select kurs.users.id_user, coalesce(count(kurs.support.id_user), 0) as count_msg
            from kurs.users
            left join kurs.support on kurs.support.id_user = kurs.users.id_user and type_msg = 1 and read_msg = false
			group by kurs.users.id_user
			order by kurs.users.id_user`);
            res.json(msgFromUsers);
        }

        catch(e) {
            console.log(e)
        }
    }

    async getDialog(req, res) {
        const {
            id_user
        } = req.params;
        if (Number(id_user)) {
            const dialogData = await db.query(`select date_sent, message, type_msg from kurs.support where id_user = ($1)
            order by id;`, [id_user]);
            res.json(dialogData);
        } else {
            const tokenId = jwt.decode(id_user).id_user;
            const dialogData = await db.query(`select date_sent, message, type_msg from kurs.support where id_user = ($1)
            order by id;`, [tokenId]);
            res.json(dialogData);
        }

    }

    async getAboutUser(req, res) {
        const { id_user } = req.params;
        const aboutUser = await db.query(`
        select date_birth::timestamp at time zone 'Etc/Greenwich' as date_birth, sex, login, extract('day' from date_trunc('day',now() - date_registr)) as all_days\n 
        from kurs.about_users, kurs.users where kurs.about_users.id_user = ($1) \n
        and kurs.about_users.id_user = kurs.users.id_user \n
        group by date_birth, sex, login, date_registr;`, [id_user]);
        res.json(aboutUser.rows[0])
    }

    async bannedUser(req, res) {
        const { time_ban, id_user } = req.body;
        try {
        const banUserQuery = await db.query(`update kurs.users set ban = (now() + interval '${time_ban} hour') where id_user = ($1) returning *;`, [id_user]);
        res.json(banUserQuery.rows[0]);
    } catch(error) {
        res.json({
          code: error.code,
          message: error.message
        })
      }
      }

    async deleteUser(req, res) {
        const { id_user } = req.params;
        const deleteUserQuery = await db.query(`
        delete from kurs.users where id_user = ($1)`, [id_user]);
        res.json(deleteUserQuery.rows[0]);
    }

    async userChangePassword(req, res) {
        const {
            new_password,
            id_user
        } = req.body;
        const setNewPassQuery = await db.query(
            `UPDATE kurs.users SET password = ($1) WHERE id_user = ($2)`, [new_password, id_user]);
        res.json(setNewPassQuery.rows[0]);
    }

    async userLogout(req, res) {
        const {
            id_user
        } = req.body;
        const setOnline = await db.query(
            `UPDATE kurs.users SET online = false WHERE id_user = ($1)`, [id_user]);
        res.json(setOnline.rows[0]);
    }

}

module.exports = new UserController();