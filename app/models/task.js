const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const taskSchema = Schema({
    createby : { type : Schema.Types.ObjectId , ref : 'User'},
    title : { type : String , required : true },
    goal : { type : String , required : true },
    assignto : { type : String , required : true },
    body : { type : String , required : true },
    commentCount : { type : Number , default : 0 },
} , { timestamps : true , toJSON : { virtuals : true } });

taskSchema.plugin(mongoosePaginate);

taskSchema.methods.path = function() {
    return `/tasks/${this.title}`;
}

taskSchema.methods.inc = async function(field , num = 1) {
    this[field] += num;
    await this.save();
} 


taskSchema.virtual('comments' , {
    ref : 'Comment',
    localField : '_id',
    foreignField : 'course'
})


module.exports = mongoose.model('Task' , taskSchema);