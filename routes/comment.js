/**
 * Created by liuxu on 2018/7/3.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended:false});
router.use(express.static('public'));

var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'zekaijiang',
    database : 'NEWSWEB',
    port: 3306
});

var loadParams = {
    newsTitle : '',
    newsPublisher : '',
    newsPublishTime : '',
    newsText : '',
    newsClassID : '',
    newsClassText : '',
    topStoriesItems : '',

    commentItems : '',
    commentPublisher : '',
    commentText : '',
    commentPic : '',
    commentTime : '',
    commentCount : '',

}

var pool = mysql.createPool(require('../config/database').mysql);

/* GET home page. */
router.post('/', function(req, res, next) {

    console.log(params);

    var loadParams = {
        userName:'',
        username:'',
    }

    var params = req.query;
    var newsID = params.newsID;


    pool.getConnection(function (err, connection) {

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

        var selectQuery = "select * from users where userName = ?;"
        connection.query(selectQuery, [req.body.userName], function (err, result, next) {

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

        var sql = "select * from news natural join class where newsID = ?;"

        connection.query(sql, [newsID], function (err, result, next) {
            console.log(result);
            console.log("record length is :" + result.length);
            var recordLength = result.length;
            if (err || recordLength < 1) {
                //res.render('loginError');
                console.log("goto login page again");
                res.redirect('/error');
            }

            else {
                loadParams.newsTitle = result[0].title;
                loadParams.newsPublisher = result[0].publisher;
                loadParams.newsPublishTime = result[0].publishTime;
                loadParams.newsText = result[0].newsText;
                loadParams.newsClassID = result[0].classID;
                loadParams.newsClassText = result[0].classDescription;
                loadParams.newsPic = result[0].newsPicture;
                //console.log(loadParams);

                console.log("go to post page");
            }

        });

        var topStoriesSql = "select newsID,title,newsPicture,publisher,publishTime,newsPicture from news where classID = 13 or classID = 11 limit 0,4;"

        connection.query(topStoriesSql, function (err, result, next) {
            console.log("in top stories!!!!!!!");
            var recordLength = result.length;
            if (err || recordLength < 1) {
                console.log("topStories sql error");
                //res.redirect('/index');
            }
            else
            {
                loadParams.topStoriesItems = result;
            }

        });

        var commentSql = "select *from comments where newsID = ? ;"

        connection.query(commentSql, [newsID], function (err, result, next) {
            console.log("This is comment");
            var recordLength = result.length;
            loadParams.commentCount = recordLength;
            if(err || recordLength < 1) {
                console.log("comment sql error");
            }
            else
            {
                loadParams.commentItems = result;
            }
            console.log("Items of Post Page is : ");
            console.log(loadParams);

            res.render('post',loadParams);

        })
    });

});

module.exports = router;