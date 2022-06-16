const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const remarkSchema = new Schema({
    body: String,
    performance: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Login'
    },

})


module.exports = mongoose.model('Remark', remarkSchema);