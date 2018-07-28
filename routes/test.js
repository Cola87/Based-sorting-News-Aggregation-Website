/**
 * Created by liuxu on 2018/7/4.
 */
/**
 * express接收html传递的参数
 */
var express = require('express');
var router = express.Router();





router.get('/',function (req,res,next) {

    console.log("aaaa");

    console.log("in login js, req is" +  req.body);
    console.log("  res is :" + req.body);

    res.render('test');


});



module.exports = router;


