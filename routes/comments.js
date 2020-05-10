var express = require('express');
var Comment = require('../schemas/comment');

var router = express.Router();

//1. id로 댓글 조회한 뒤 populate메서드로 관련있는 컬렉션의 다큐먼트를 불러옴.
//Comment스키마 commenter필드의 ref가 User로 되어있어서 알아서 users컬렉션에서 사용자 다큐먼트를 찾아 합침.
//commenter필드가 사용자다큐먼트로 치환되면서 commenter필드 ObjectId는 그 ObjectId를 가진 사용자 다큐먼트가 됨.
router.get('/:id', function (req, res, next) {
    Comment.find({ commenter: req.params.id }).populate('commenter')
        .then((comments) => {
            console.log(comments);
            res.json(comments);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

//2.Comment스키마로 comment객체를 만들어 안에 다큐내용을 넣은뒤save로 저장.
//반환된 result객체를 populate메서드로 User스키마와 합침.(path옵션으로 필드지정)
router.post('/', function (req, res, next) {
    const comment = new Comment({
        commenter: req.body.id,
        comment: req.body.comment,
    });
    comment.save()
        .then((result) => {
            return Comment.populate(result, { path: 'commenter' });
        })
        .then((result) => {
            res.status(201).json(result);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

//3.update메서드:인자1>어떤 다큐를 수정할지, 인자2>수정할필드와 값이 들어있는 객체. 기입한 필드만 바꿔주는특징.
router.patch('/:id', function (req, res, next) {
    Comment.update({ _id: req.params.id }, { comment: req.body.comment })
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

//4.remove메서드에 어떤객체를 삭제할지 인지넣어줌.
router.delete('/:id', function (req, res, next) {
    Comment.remove({ _id: req.params.id })
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

module.exports = router;