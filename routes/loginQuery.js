/**
 * Created by liuxu on 2018/7/4.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended:false});
router.use(express.static('public'));

/**
 * 配置MySql
 */
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'zekaijiang',
    database : 'NEWSWEB',
    port: 3306
});

var pool  = mysql.createPool(require('../config/database').mysql);

var loadParams = {
    hotestNewsID: '',
    hotestNewsTitle:'',
    hotestNewsClassText:'',
    hotestPic:'',

    userName:'',
    username:'',

    secondNewsID:'',
    secondNewsTitle:'',
    secondNewsClassText:'',
    secondPic:'',

    thirdNewsID:'',
    thirdNewsTitle:'',
    thirdNewsClassText:'',
    thirdPic:'',

    likedList:'',
    topStoriesItems:'',
    topStories2Items:'',
    categoryItems:'',
    commentItems:'',
}
router.post('/',urlEncodedParser,function (req,res,next) {


    pool.getConnection(function (err, connection) {
        console.log("in loginCheck ")
        console.log("req.url is :" + req.url);

        console.log("req.body is :" + req.body.userName);

        var selectQuery = "select * from users where userName = ? and userPassword = ?;"
        connection.query(selectQuery, [req.body.userName, req.body.userPassword], function (err, result, next) {

            console.log(result);
            console.log("record length is :" + result.length);
            var recordLength = result.length;
            if (err || recordLength < 1) {
                //res.render('loginError');
                console.log("goto login page again");
                res.redirect('/login');
            }

            else {
                console.log("go to index page");
                loadParams.userName = req.body.userName;
                loadParams.username = req.body.userName;
            }

        });

        var hotsetSql = "select count(*) as likedTime,newsID,title,classDescription,newsPicture from news natural join give_like natural join class group by newsID order by likedTime desc;"
        connection.query(hotsetSql,  function (err, result, next) {
            //console.log(result);
            console.log("record length is :" + result.length);

            var recordLength = result.length;
            if (err || recordLength < 1) {
                console.log("hotest sql error");
                //res.redirect('/index');
            }

            else {
                console.log("go to index page");
                loadParams.likedList = result;

                loadParams.hotestNewsID = result[0].newsID;
                loadParams.hotestNewsTitle = result[0].title;
                loadParams.hotestNewsClassText = result[0].classDescription;
                loadParams.hotestPic = result[0].newsPicture;

                loadParams.secondNewsID = result[1].newsID;
                loadParams.secondNewsTitle = result[1].title;
                loadParams.secondNewsClassText = result[1].classDescription;
                loadParams.secondPic = result[1].newsPicture;

                loadParams.thirdNewsID = result[2].newsID;
                loadParams.thirdNewsTitle = result[2].title;
                loadParams.thirdNewsClassText = result[2].classDescription;
                loadParams.thirdPic = result[2].newsPicture;

                loadParams.userName = req.body.userName;
                // loadParams.userName = 'world';

                console.log('look what');
                console.log(loadParams);

                //res.render('index', {hotestNewsID: result[0].newsID,hotestNewsTitle:result[0].title,userName:'world'});
                console.log("aaaaaaaaaaaaaaaaaaaa");

            }
        });

        var topStories2Sql = "select newsID,title,newsPicture,publisher,publishTime,newsPicture from news where classID = 10 or classID = 9 limit 0,6;"

        connection.query(topStories2Sql, function (err, result, next) {
            console.log("in top stories!!!!!!!");
            var recordLength = result.length;
            if (err || recordLength < 1) {
                console.log("topStories2 sql error");
                //res.redirect('/index');
            }
            else
            {
                loadParams.topStories2Items = result;
            }

        });

        var topStoriesSql = "select newsID,title,newsPicture,publisher,publishTime from news where classID = 13 or classID = 11 limit 0,6;"

        connection.query(topStoriesSql,function (err, result, next) {
            console.log("in top stories!!!!!!!")
            var recordLength = result.length;
            if (err || recordLength < 1) {
                console.log("top stories sql error");
                //res.redirect('/index');
            }
            else
            {
                loadParams.topStoriesItems = result;
            }

        });

        var trendingSql = "select count(*) as comtCount,newsID,title,newsPicture,publisher,publishTime from comments natural join news group by newsID order by comtCount desc;"

        connection.query(trendingSql, function (err, result, next) {
            //console.log(result);
            console.log("record length is :" + result.length);

            var recordLength = result.length;
            if (err || recordLength < 1) {
                console.log("trending sql error");
                //res.redirect('/index');
            }

            else {
                loadParams.commentItems = result;
            }

        });

        var categorySql = "select count(*) as cateCount,classID,classDescription from class natural join classify group by classID order by cateCount desc;"

        connection.query(categorySql, function (err, result, next) {
            //console.log(result);
            console.log("record length is :" + result.length);

            var recordLength = result.length;
            if (err || recordLength < 1) {
                console.log("category sql error");
                //res.redirect('/index');
            }

            else {
                loadParams.categoryItems = result;
            }
            console.log("categoryItems is :");
            console.log(loadParams);
            res.render('index',loadParams);

        });

        connection.release();

    });
});

module.exports = router;