const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {secret} = require('../config')

const generateAccessToken = (login) => {
    const payload = {
        login
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
        if (req.body.password !== '' && req.body.date_birth !== '' && req.body.sex !== '') {
            addAboutUser = await db.query(`
            update kurs.about_users set date_birth = ($1)::timestamp at time zone 'Europe/Moscow', 
            sex = ($2)
            where id_user = ($3)`, [date_birth, sex, id_user]);
            changePassword = await db.query(`
            update kurs.users set password = ($1)
            where id_user = ($2)`, [password, id_user]);
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
            const hashPassword = bcrypt.hashSync(String(password), 7)
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
                SELECT id_user, password from kurs.users WHERE login = ($1);`, [login]);
            const validPassword  = bcrypt.compareSync(String(password), passwordRequest.rows[0].password);
            const token = generateAccessToken(login)
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

    async getAboutUser(req, res) {
        const { id_user } = req.params;
        const aboutUser = await db.query(`
        select date_birth::timestamp at time zone 'Etc/Greenwich' as date_birth, sex, login, extract('day' from date_trunc('day',now() - date_registr)) as all_days \n 
        from kurs.about_users, kurs.users where kurs.about_users.id_user = ($1) \n
        and kurs.about_users.id_user = kurs.users.id_user`, [id_user]);
        res.json(aboutUser.rows[0])
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

    async deleteUser(req, res) {
        const {
            id_user
        } = req.body;
        const userDeleteQuery = await db.query(`
            DELETE FROM kurs.users WHERE id_user = ($1)`, [id_user]);
        res.json(userDeleteQuery.rows[0]);
    }
}

module.exports = new UserController();