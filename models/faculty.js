const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    filename: String,
    url: String
});

imageSchema.virtual('thumbanil').get(function(){
    return this.url.replace('/upload','/upload/w_200'); // not store in database it is just derived
});
const FacultySchema = new Schema({
    name: String,
    department: String,
    qualifications: String,
    experience: Number,
    designation: String,
    image: [imageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Login'
    },
});


FacultySchema.post('findOneAndDelete', async function(doc) {
    if (doc.image) {
        for (const img of doc.image) {
          await cloudinary.uploader.destroy(img.filename);
        }
      }
});


module.exports = mongoose.model('Faculty', FacultySchema);