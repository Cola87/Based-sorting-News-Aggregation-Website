var express = require('express');
var router = express.Router();


var userDao = require('../dao/userDao');

/* GET users listing. */
router.get('/updateUser', function(req, res, next) {
  res.render('updateUser');
});

router.get('/signup',function(req,res,next){
    res.render('signup');
    //userDao.add(req,res,next);
} );

router.post('/signup',function(req,res,next){
    userDao.add(req,res,next);
} );


module.exports = router;
