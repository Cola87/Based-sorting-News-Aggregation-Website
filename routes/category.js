var  express = require('express');
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
    allNewsInClass:'',
    cateNames:'',
    topStoriesItems:'',
    topStories2Items:'',
}

/* GET category page. */
router.get('/', function(req, res, next) {
    pool.getConnection(function (err, connection) {

        var classID = req.query.classID;
        console.log("classId is "+ classID);

        var categorySql = "select news.newsID,title,newsPicture,publisher,publishTime,classDescription from class natural join classify join news on classify.newsID = news.newsID where classify.classID = ?;";
        var items;

        connection.query(categorySql, [classID], function (err, result, next) {

            var recordLength = result.length;
            if (err || recordLength < 1) {
                console.log("category sql error");
                res.redirect('/error');
            }

            else {
                console.log("length = " + result.length);
                loadParams.allNewsInClass = result;
                console.log("cate: " + items);


            }
        });

        var categoryDescript = "select classID,classDescription from class where classID = ?;"

        connection.query(categoryDescript, [classID], function (err, result, next) {

            var recordLength = result.length;
            if (err || recordLength < 1) {
                console.log("categoryDescript sql error");
                res.redirect('/error');
            }

            else {
                console.log("length = " + result.length);
                loadParams.cateNames = result;
                console.log(loadParams);

            }
        });

        var topStories2Sql = "select newsID,title,newsPicture,publisher,publishTime,newsPicture from news where classID = 2 or classID = 8 limit 0,6;"

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

        var topStoriesSql = "select newsID,title,newsPicture,publisher,publishTime from news where classID = 13 or classID = 5 limit 0,6;"

        connection.query(topStoriesSql, function (err, result, next) {
            console.log("in top stories!!!!!!!")
            var recordLength = result.length;
            if (err || recordLength < 1) {
                console.log("topStories sql error");
                //res.redirect('/index');
            }
            else
            {
                loadParams.topStoriesItems = result;
                // res.render('category',{allNewsInClass:items, cateNames:loadParams, topStoriesItems:result});
            }

            res.render('category',loadParams);

        });

        connection.release();


    });

});

module.exports = router;
