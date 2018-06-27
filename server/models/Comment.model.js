var mongoose = require("mongoose");

var Schema = mongoose.Schema; 


var commentSchema = new Schema({
   
    customer_id:    String,
    customer_name:  String,
    customer_level: Number,
    content:        String,
    created_at:     Date,
    motel_id:       String,
    status:         {type: Number, default: 0}



});
commentSchema.set('autoIndex', false);
commentSchema.index(
    {'$**': 'text'}
)

var comments  = mongoose.model("comments", commentSchema);

module.exports = comments;