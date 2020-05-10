var express = require('express');
var User = require('../schemas/user');

var router = express.Router();

//User.find로 모든 사용자를 찾은 뒤, mongoose.pug를 렌더링할 때 users변수로 넣어준다.
router.get('/', function (req, res, next) {
  User.find({})
    .then((users) => {
      res.render('mongoose', { users });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

module.exports = router;
