var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var commentService = require('../services/comment.service');
var tests = require('../models/Test.model');
router.post('/insert', insert);
router.get('/find-by-motel/:id', findByMotel );
router.get('/find-by-status/:status', findByStatus);

router.put('/:id', update );
router.delete('/:id', _delete);

function insert(req,res)
{
    commentService.insert(req.body).then(function () {
        res.status(200).send("insert ok");
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}
function update(req,res)
{  
    // delete property _id
    delete req.body['_id'];

    //find by id and update
    // motel.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    //     if (err) return next(err);
    //     res.json("Update success!");
    //   });
    commentService.updateStatus(req.params.id, req.body).then(function() {
        res.status(200).send("update ok");
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}
function findByStatus(req, res) {

    
    commentService.findByStatus(req.params.status).then(function(comments){
        if(comments)
        // search successful
        res.status(200).send(comments);
    else{
        // search fail
        res.status(400).send("No Result");
    }
    })
    .catch(
        function (err) {
            res.status(400).send(err);
        }
    );
        
}

function findByMotel(req,res)
{
    commentService.findByMotel(req.params.id).then(function(comments){
        if(comments)
            // search successful
            res.status(200).send(comments);
        else{
            // search fail
            res.status(400).send("No Result");
        }
    })
    .catch(
        function (err) {
            res.status(400).send(err);
        }
    );
}
function _delete(req, res) {
    
    commentService.delete(req.params.id)
        .then(function () {
            res.status(200).send("delete ok");
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
module.exports = router;