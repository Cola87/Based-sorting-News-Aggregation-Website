/**
 * Created by liuxu on 2018/7/3.
 */

var user = {
    insert:'insert into users(userName,userPassword,email) values (?,?,?);',
    update: 'update users set password=? ,where id = ?;',
    select: 'select * from users where userName = ? and userPassword = ?;'

};

module.exports = user;
