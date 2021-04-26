var express = require('express');
var router = express.Router();

var dbget = require('../db/get.js');
var dball = require('../db/all.js');
var dbdo = require('../db/exec.js');

/* ログインページの処理 */
router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'Login', 
        login: req.session.login
    });
});
router.post('/login', async function(req, res, next) {
    
    let account = req.body.account;
    let pass = req.body.password;

    let sql = "select * from users where account = '"
        + account + "' and password = '" + pass + "'";
    let record = await dbget.getRow(sql);
    if(record != undefined){
        req.session.login = record;
    }
    res.redirect('/');
});

/* ログアウトページの処理 */
router.get('/logout', function(req, res, next) {
    req.session.login = undefined;
    res.redirect('/users/login');
});

/* Adminの処理 */
router.get('/admin', async function(req, res, next) {
    if(req.session.login == undefined){
        res.redirect('/users/login');
    }
    if(req.session.login.role != 'admin'){
        res.redirect('/users/login');
    }
    res.render('admin', {
        title: 'Admin', 
        login: req.session.login
    });
});
router.post('/admin', async function(req, res, next) {
    let account = req.body.account;
    let pass = req.body.password;
    let name = req.body.name;
    let sql = "insert into users (account, password, name, role) values('" + account + "','" + pass + "','" + name + "','user')";
    await dbdo.exec(sql);
    res.render('admin', {
        title: 'Admin', 
        login: req.session.login
    });
});

/* Admin2の処理 */
router.get('/admin2', async function(req, res, next) {
    if(req.session.login == undefined){
        res.redirect('/usrs/login');
    }
    if(req.session.login.role != 'admin'){
        res.redirect('/users/login');
    }
    let sql = "select * from users";
    let records = await dball.getAllRows(sql);
    res.render('admin2', {
        title: 'Admin2', 
        login: req.session.login,
        data: records
    });
});

/* del_usrの処理 */
router.get('/del_usr', async function(req, res, next) {
    if(req.session.login == undefined){
        res.redirect('/users/login');
    }
    if(req.session.login.role != 'admin'){
        res.redirect('/users/login');
    }
    let id = req.query.id;
    let sql = "delete from users where id =" + id;
    await dbdo.exec(sql);
    res.redirect("/users/admin2");
});

module.exports = router;
