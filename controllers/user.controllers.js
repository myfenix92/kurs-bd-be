const db = require('../db');
const md5 = require('md5');

class UserController {

    async aboutUser(req, res) {
        const { id_user, date_birth, sex } = req.body;
        const addAboutUser = await db.query(`
            insert into kurs.about_users (id_user, age, sex, date_registr) 
            values ($1, (SELECT date_part('year',age(($2)::date))), $3, now())`, [id_user, date_birth, sex])
        res.json(addAboutUser.rows);
    }

    async userCreate(req, res){
        const { login, password, date_birth, sex  } = req.body;
        const loginCheckQuery = await db.query(
            `SELECT count(id_user) FROM kurs.users WHERE login = ($1);`, [login]);

        if(+loginCheckQuery.rows[0].count) {
            res.json({
                regStatus: 0,
                regText: 'User alredy exist',
            });
        }
        else {
            const newUserQuery = await db.query(
                `INSERT INTO kurs.users VALUES ($1, $2) RETURNING *`, [login, password]);
            res.json({
                regStatus: 1,
                regText: 'Registered',
                id_user: newUserQuery.rows[0].id_user
            });
            const addAboutUser = await db.query(`
            insert into kurs.about_users (id_user, age, sex, date_registr) 
            values ($1, (SELECT date_part('year',age(($2)::date))), $3, now())`, [newUserQuery.rows[0].id_user, date_birth, sex])
        }
    }

    async userLogin(req, res){
        const { login, password } = req.body;
        const passwordRequest = await db.query(`
            SELECT id_user, password from kurs.users WHERE login = ($1);`, [login]);
        const tabPassword = +passwordRequest.rows[0].password;
        const userExist = password === tabPassword ? true : false;
        console.log(userExist);
        if(!userExist){
            res.json({
                loginStatus : 0,
                loginMessage: 'Wrong login or password'
            })
        }
        else{
            res.json({
                loginStatus : 1,
                loginMessage: 'Login success',
                loginToken: md5(Date.now()),
                id_user: passwordRequest.rows[0].id_user
            })
        }
    }

    async userChangePassword(req, res){
        const { new_password, id_user } = req.body;
        const setNewPassQuery = await db.query(
            `UPDATE kurs.users SET password = ($1) WHERE id_user = ($2)`, [new_password, id_user]);
        res.json(setNewPassQuery.rows[0]);
    }

    async deleteUser(req, res){
        const { id_user } = req.body;
        const userDeleteQuery = await db.query(`
            DELETE FROM kurs.users WHERE id_user = ($1)`, [id_user]);
        res.json(userDeleteQuery.rows[0]);
    }
}

module.exports = new UserController();