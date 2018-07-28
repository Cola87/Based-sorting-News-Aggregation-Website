var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'zekaijiang',
    database : 'NEWSWEB',
    port: 3306
});
var pool  = mysql.createPool(require('../config/database').mysql);

var loadParams = {
    hotestNewsID:'',
    hotestNewsTitle:'',
    hotestNewsClassText:'',
    userName:'',
    hotestPic:'',
    hotestClassID:'',

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
    commentItems:'',
    categoryItems:'',
    // botStoriesItems:'',

}

/* GET home page. */
router.get('/', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var hotsetSql = "select count(*) as likedTime,newsID,title,classDescription,newsPicture from news natural join give_like natural join class group by newsID order by likedTime desc;"
        connection.query(hotsetSql, function (err, result, next) {
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
                loadParams.hotestPic  = result[0].newsPicture;

                loadParams.secondNewsID = result[1].newsID;
                loadParams.secondNewsTitle = result[1].title;
                loadParams.secondNewsClassText = result[1].classDescription;
                loadParams.secondPic  = result[1].newsPicture;

                loadParams.thirdNewsID = result[2].newsID;
                loadParams.thirdNewsTitle = result[2].title;
                loadParams.thirdNewsClassText = result[2].classDescription;
                loadParams.thirdPic  = result[2].newsPicture;

                // loadParams.userName = 'word';
                //console.log(loadParams);

                // res.render('index', {hotestNewsID: result[0].newsID,hotestNewsTitle:result[0].title,userName:'world'});
                console.log("aaaaaaaaaaaaaaaaaaba");
                // console.log(loadParams);


            }
        });

        var topStories2Sql = "select newsID,title,newsPicture,publisher,publishTime from news where classID = 10 or classID = 2 limit 0,4;"

        connection.query(topStories2Sql, function (err, result, next) {
            console.log("in top stories!!!!!!!")
            var recordLength = result.length;
            if (err || recordLength < 1) {
                console.log("topstories sql error");
                //res.redirect('/index');
            }
            else
            {
                loadParams.topStories2Items = result;
            }
            console.log("topStoriesItems is :");
            console.log(loadParams);
            // res.render('index',loadParams);
        });

      var topStoriesSql = "select newsID,title,newsPicture,publisher,publishTime from news where classID = 13 or classID = 3 limit 0,4;"

        connection.query(topStoriesSql, function (err, result, next) {
            console.log("in top stories!!!!!!!")
            var recordLength = result.length;
            if (err || recordLength < 1) {
                console.log("topstories sql error");
                //res.redirect('/index');
            }
            else
            {
                loadParams.topStoriesItems = result;
            }
            console.log("topStoriesItems is :");
            console.log(loadParams);
            // res.render('index',loadParams);
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
            console.log("Items of Index Page is :");
            console.log(loadParams);
            res.render('index',loadParams);

        });

      connection.release();

    });

});

module.exports = router;

