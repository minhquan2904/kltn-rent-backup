var comments = require('../models/Comment.model');
var users = require('../models/User');

var Q = require('q');
var _ = require('lodash'); 
var moment = require('moment');
var service = {};

//service.create = create; 
service.insert = insert;
service.findByMotel = findByMotel;
service.findByStatus = findByStatus;
// service.search = search;
service.delete = _delete;
service.updateStatus = updateStatus;
module.exports = service;
function findByStatus(status) {
    var deferred = Q.defer();

    comments.find({status: status}, function(err,comments)
    {
        if(err)
            deferred.reject(err.name + ': ' + err.message);
        if(comments.length > 0)
        {
            // success
            
            deferred.resolve(comments);
        }
        else
        {
            deferred.reject("No result found");
        }
    });


    return deferred.promise;
}
function updateStatus(_id, comment) {
    var deferred = Q.defer();

    comments.findByIdAndUpdate(_id, {$set: comment}, function(err, result) {
        if(err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            if(comment.status === 1) { // in pending => accept
                updateIncreaseLevel();
            } else {
               if(comment.status === 0) {// in accepted => pending
                    updateDecreaseLevel();
               } else { // in pending => ignore
                    deferred.resolve();
               }
            }
            
           
        }
    })
    return deferred.promise;

    function updateIncreaseLevel() {
        users.findById(comment.customer_id, function(err, user) {
            if(err) {
                deferred.reject(err.name + ': ' + err.message);
            } else {
                var rating = user.rating;

                rating.exp += 5;
                if (rating.level === 1 && rating.exp >= 50) {
                    rating.level = 2;
                }
                if(rating.level === 2 && rating.exp >= 100) {
                    rating.level = 3;
                }
                if(rating.level === 3 && rating.exp >= 200) {
                    rating.level = 4;
                }

                users.findByIdAndUpdate(comment.customer_id, user, function(err, user) {
                    if(err) {
                        deferred.reject(err.name + ': ' + err.message);
                    } else {
                        deferred.resolve();
                    }
                });
            }
        });
    }

    function updateDecreaseLevel() {
        users.findById(comment.customer_id, function(err, user) {
            if(err) {
                deferred.reject(err.name + ': ' + err.message);
            } else {
                var rating = user.rating;

                rating.exp -= 5;
                if(rating.level === 2 && rating.exp < 100) {
                    rating.level = 1;
                }
                if(rating.level === 3 && rating.exp < 200) {
                    rating.level = 2;
                }

                users.findByIdAndUpdate(comment.customer_id, user, function(err, user) {
                    if(err) {
                        deferred.reject(err.name + ': ' + err.message);
                    } else {
                        deferred.resolve();
                    }
                });
            }
        });
    }
}
function insert(comment)
{
    var deferred = Q.defer();
    comments.create(comment, function (err, item) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
    });
    return deferred.promise;
}
function findByMotel(id)
{
    var deferred = Q.defer();
    comments.find({motel_id: id, status: 1}, function(err, items){
        if (err) deferred.reject(err.name + ': ' + err.message);
        if(items) {
            
            // console.log();
            items.map(item => {
                item.fromNow = moment(item.created_at).fromNow();
                console.log(item.fromNow);
            });
            deferred.resolve(items);
        }
        else{
            deferred.reject();
        }
    })
    return deferred.promise;
}
function _delete(_id) {
    var deferred = Q.defer();

   comments.findByIdAndRemove(_id, function(err, res){
    if(err) deferred.reject(err);

    deferred.resolve();
    });

    return deferred.promise;
}