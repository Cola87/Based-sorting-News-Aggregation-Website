/**
 * Created by liuxu on 2018/7/3.
 */
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

var loadParams = {
    newsTitle : '',
    newsPublisher : '',
    newsPublishTime : '',
    newsText : '',
    newsClassID : '',
    newsClassText : '',

    topStoriesItems : '',
    topStories2Items : '',

    commentItems : '',
    commentPublisher : '',
    commentText : '',
    commentPic : '',
    commentTime : '',
    commentCount : '',

}

var pool = mysql.createPool(require('../config/database').mysql);

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("in post");
    console.log(params);
    var params = req.query;
    var newsID = params.newsID;

    var sql = "select * from news natural join class where newsID = ?;"

    pool.getConnection(function (err, connection) {
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

        var topStoriesSql = "select newsID,title,newsPicture,publisher,publishTime,newsPicture from news where classID = 13 or classID = 6 limit 0,6;"

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

        var commentSql = "select * from comments where newsID = ? ;"

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

function showPic(e, id, obj) {
    var u = $(obj).attr('sss');
    console.log(u);
    var ur = basePath+"/"+u;
    var x, y;
    x = e.clientX;
    y = e.clientY;
    document.getElementById("Layer1").style.left = x + 2 + 'px';
    document.getElementById("Layer1").style.top = y + 2 + 'px';
    document.getElementById("Layer1").innerHTML = "<img border='0' width='200px' height='200px'  src='"+ur+"'>";
    document.getElementById("Layer1").style.display = "";
}
function hiddenPic() {
    document.getElementById("Layer1").innerHTML = "";
    document.getElementById("Layer1").style.display = "none";
}
