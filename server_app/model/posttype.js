const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const posttypeSchema = new Schema({
    name: { type: String, required: true } 
},
{
    price:{type:Number,require:true}
},
 {
    timestamps: true
});
module.exports = mongoose.model('PostType', posttypeSchema);