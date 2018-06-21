var mongoose = require("mongoose");

var Schema = mongoose.Schema; 


var motelSchema = new Schema({
    _creator:       { type: Schema.Types.ObjectId, ref: 'User' },
    add:            String,
    address:        String,
    area:           { type: Number, default: 0},
    category:       String,
    city:           String,
    contact:        String,
    created_at:     {required: true, type: Date, default: new Date()},
    customer:       String,
    description:    String,
    district:       String,
    fields:         { type: [String], index: true, text: true },
    img:            {type: [String]},
    lng:            String,
    lat:            String,
    price:          { type: String, default: "Thỏa thuận"},
    rating:         {type: Number, default: 4.75},
    status:         { type: Number, default: 0},
    street:         String,
    title:          { type: String, required: true },
    ward:           String
},{collection : 'motels'});

motelSchema.set('autoIndex', false);
motelSchema.index(
    { "category" : "text", 
        "city": "text"
    },
    {
        "weights": {
            "category": 5,
            "city": 2
        }
    }
    );
var motels  = mongoose.model("motels", motelSchema);

module.exports = motels;