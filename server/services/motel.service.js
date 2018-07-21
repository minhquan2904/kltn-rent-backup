
var motels = require('../models/Motel.model');
var users = require('../models/User');
var statistics = require('../models/Statistic.model');
var Q = require('q');
var _ = require('lodash'); 
var service = {};

//service.create = create; 
service.create = create;
service.delete = _delete;
service.findByUser = findByUser;
service.findById = findById;
service.findLtPrice = findLtPrice;
service.findByStatus = findByStatus;
service.findRecent = findRecent;
service.fullSearch = fullSearch;
service.getListNearBy = getListNearBy;
service.getLatLng = getLatLng;
service.updateStatus = updateStatus;
service.update = update;
service.test = test;
module.exports = service;

function test(searchString) {
    var deferred = Q.defer();
    
    motels.find({$text: {$search: searchString}})
    .skip(20)
    .limit(10)
    .exec(function(err, motels) {
        if(err) { 
            deferred.reject(err);
        }
        deferred.resolve(motels);
     });
    return deferred.promise;     
}
function fullSearch(value) {
    var deferred = Q.defer();

    motels.find({$or:[{title: { $regex: '.*' + value + '.*' } }, {city:{ $regex: '.*' + value + '.*' }}, {district:{ $regex: '.*' + value + '.*' }}, {ward: { $regex: '.*' + value + '.*' }}, {street: { $regex: '.*' + value + '.*' }}, {description: { $regex: '.*' + value + '.*' }}, {status: 1}] },  function(err, motels) {
        if(err) { 
            deferred.reject(err);
        }
        if(motels) {
            deferred.resolve(motels);
        } else {
            deferred.reject();
        }
       
    });
    return deferred.promise;
}
function findRecent() {
    var deferred = Q.defer();
    motels.find({status: 1}).sort({created_at: -1, rating: -1}).limit(6).exec(function (err, motels) {
        if (err) deferred.reject(err.name + ': ' + err.message);
       

        deferred.resolve(motels);
    });
    return deferred.promise;
}
function findByStatus(status) {
    var deferred = Q.defer();

    motels.find({status: status}, function(err,motels)
    {
        if(err)
            deferred.reject(err.name + ': ' + err.message);
        if(motels.length > 0)
        {
            // success
            
            deferred.resolve(motels);
        }
        else
        {
            deferred.reject("No result found");
        }
    });


    return deferred.promise;
}
function update(_id, motel) {
    var deferred = Q.defer();

    motels.findByIdAndUpdate(_id, {$set: motel}, function(err, result) {
        if(err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            deferred.resolve();
        }
    })
    return deferred.promise;
}
function updateStatus(_id, motel) {
    var deferred = Q.defer();

    motels.findByIdAndUpdate(_id, {$set: motel}, function(err, result) {
        if(err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            if(motel.status === 1) { // in pending => accept
                updateIncreaseLevel();
            } else {
               if(motel.status === 0) {// in accepted => pending
                    updateDecreaseLevel();
               } else { // in pending => ignore
                    deferred.resolve();
               }
            }
            
           
        }
    })
    return deferred.promise;

    function updateIncreaseLevel() {
        users.findById(motel.customer, function(err, user) {
            if(err) {
                deferred.reject(err.name + ': ' + err.message);
            } else {
                var rating = user.rating;

                rating.exp += 20;
                if (rating.level === 1 && rating.exp >= 50) {
                    rating.level = 2;
                }
                if(rating.level === 2 && rating.exp >= 100) {
                    rating.level = 3;
                }
                if(rating.level === 3 && rating.exp >= 200) {
                    rating.level = 4;
                }

                users.findByIdAndUpdate(motel.customer, user, function(err, user) {
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
        users.findById(motel.customer, function(err, user) {
            if(err) {
                deferred.reject(err.name + ': ' + err.message);
            } else {
                var rating = user.rating;

                rating.exp -= 20;
                if(rating.level === 2 && rating.exp < 100) {
                    rating.level = 1;
                }
                if(rating.level === 3 && rating.exp < 200) {
                    rating.level = 2;
                }

                users.findByIdAndUpdate(motel.customer, user, function(err, user) {
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

function create(motelParam)
{
    var deferred = Q.defer();

    motels.findOne(
        {add : motelParam.add, ward: motelParam.ward ,district: motelParam.district, city: motelParam.city  },
        function(err,motel)
        {
            if(err)
                deferred.reject(err.name + ': ' + err.message);
            if(motel)
            {
                // motel hava already existed
                deferred.reject("motel has already exist");
            }
            else
            {
                //create new motel
                createMotel();
            }

        }
    )

    function createMotel()
    {   
        motelParam.created_at = new Date();   
        motels.create(
            motelParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                const id = doc._id;
              
                deferred.resolve(id);   
            });
    }

    return deferred.promise;
}

function _delete(id)
{
    var deferred = Q.defer();
    //find by id and remove
    motels.findByIdAndRemove(id, function(err, res){
        if(err) deferred.reject(err);

        deferred.resolve();
    });

    return deferred.promise;
}
function findById(id)
{
    var deferred = Q.defer();
    motels.findOne({_id: id}, function(err,motel){
        if(err)
                deferred.reject(err.name + ': ' + err.message);
            if(motel)
            {
                // success
                updateVisitors();
                deferred.resolve(motel);
            }
            else
            {
                //create new motel
                deferred.reject("No result found");
            }
    });
    return deferred.promise;

    function updateVisitors() {

        statistics.findOne({}, {},{sort: {'created_at': -1}}, function(err, statistic) {
            if (err) {
                deferred.reject(err.name + ': ' + err.message)
            }

            statistic.update({visitors: statistic.visitors+1}, function(err, raw) {
                if (err) {
                    deferred.reject(err.name + ': ' + err.message);
                }

                console.log(raw);
            })
        });
    }
}
function findLtPrice(price)
{
    var deferred = Q.defer();

    motels.find({price: {$lte : price}}, function(err,motels)
    {
        if(err)
            deferred.reject(err.name + ': ' + err.message);
        if(motels)
        {
            // success
            deferred.resolve(motels);
        }
        else
        {
            //create new motel
            deferred.reject("No result found");
        }
    });


    return deferred.promise;
}
function findByUser(id)
{
    var deferred = Q.defer();

    motels.find(
         {customer : id  },
        function(err,motels)
        {
            if(err)
                deferred.reject(err.name + ': ' + err.message);
            if(motels)
            {
                // success
                deferred.resolve(motels);
            }
            else
            {
                //create new motel
                deferred.reject("No result found");
            }

        });
    return deferred.promise;
}
function getListNearBy(data)
{
    var deferred = Q.defer();
    var listNearBy = [] ;
    console.log(data);
    motels.find(
         {},
        function(err,motels)
        {
            if(err)
                deferred.reject(err.name + ': ' + err.message);
            if(motels)
            {
               
                motels.forEach(element => {
                    dis = distance(data, element);
                    
                    if(dis <= data.distance)
                    {
                        listNearBy.push(element);
                    }
                });
                //console.log(listNearBy);
                if(listNearBy.length > 0){ 
                    deferred.resolve(listNearBy);
                }
                else{
                    deferred.reject();
                }
                
            }
            else
            {
                //create new motel
                deferred.reject("No result found");
            }

        });
    return deferred.promise;
}
function distance(object1, object2)
{
    /** Converts numeric degrees to radians */
    if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function() {
        return this * Math.PI / 180;
        }
    }
    var circumference = 40000.0; // Earth's circumference at the equator in km
    var distance = 0.0;
   
    var latitude1Rad = degrees_to_radians(object1.lat);
    var longitude1Rad = degrees_to_radians(object1.lng);
    var latititude2Rad =  degrees_to_radians(object2.lat);
    var longitude2Rad = degrees_to_radians(object2.lng);
    
    var logitudeDiff = Math.abs(longitude1Rad-longitude2Rad);
    
    if(logitudeDiff > Math.PI)
    {
         logitudeDiff = 2.0 * Math.PI - logitudeDiff;
    }

    var angleCalculation =
        Math.acos(
          Math.sin(latititude2Rad) * Math.sin(latitude1Rad) +
          Math.cos(latititude2Rad) * Math.cos(latitude1Rad) * Math.cos(logitudeDiff));
    distance = circumference * angleCalculation / (2.0 * Math.PI);
    
    return distance;
}
function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}



function getLatLng(id)
{
    var deferred = Q.defer();

    motels.findOne({_id: id}, function (err, motel) {
        if(err) deferred.reject(err);

        if(motel)
        {
            deferred.resolve({
                lat: motel.lat,
                lng: motel.lng
                }         
            )
        }
        else{
            deferred.reject("No rs found");
        }
        

    })

    return deferred.promise;
}
