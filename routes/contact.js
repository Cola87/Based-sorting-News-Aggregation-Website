/**
 * Created by liuxu on 2018/7/3.
 */
var express = require('express');
var router = express.Router();

/* GET contact page. */
router.get('/', function(req, res, next) {
    res.render('contact');
});

module.exports = router;