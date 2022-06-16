const mongoose = require('mongoose');
const { userSchema } = require('../schmeas');
const Schema = mongoose.Schema;
const Remark = require('./remark');
const {cloudinary} = require('../cloudinaryConfig/index')

const imageSchema = new Schema({
    filename: String,
    url: String
});

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200'); // not store in database it is just derived
});
 imageSchema.virtual('cardImage').get(function() {   return this.url.replace('/upload', '/upload/ar_4:3,c_crop'); })

const UserSchema = new Schema({
    name: String,
    branch: String,
    rollno: Number,
    cgpa: Number,
    description: String,
    state: String,
    image: [imageSchema],
    semester: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Login'
    },
    club: {
        type: String,
        enum: ['ACM-CSS', 'IEEE', 'PEB', 'DRAMS', 'APC', 'DSA-N-DEV', 'SCC', 'SAASC'],
    },
    remarks: [{
        type: Schema.Types.ObjectId,
        ref: 'Remark'
    }]
});

UserSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Remark.deleteMany({
            _id: {
                $in: doc.remarks
            }
        })
    }
    if (doc.image) {
        for (const img of doc.image) {
          await cloudinary.uploader.destroy(img.filename);
        }
      }
});

module.exports = mongoose.model('User', UserSchema);