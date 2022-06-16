const Faculty = require('../models/faculty');
const {cloudinary} = require('../cloudinaryConfig/index');
const departments = ['Electronics and communication Engineering', 'Computer science Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Aerospace Enginnering', 'Production Engineering', 'Metalurgical Engineering'];
const isAuthorF = require('../middleware');
module.exports.indexFaculty = async(req, res) => {
    const faculties = await Faculty.find({});
    res.render('faculty/index', { faculties });
};

module.exports.newFacultyPage = async(req, res) => {
    res.render('faculty/new', { departments });
};

module.exports.createNewFaculty = async(req, res, next) => {
    // if(!req.body.user) next(new expressError('Invalid user data',400));
    const faculty = new Faculty(req.body.faculty);
    faculty.image = req.files.map((img) => ({ url: img.path, filename: img.filename }))
    faculty.author = req.user._id;
    await faculty.save();
    req.flash('success', 'new faculty created Successfully!');
    res.redirect(`/Faculty/${faculty._id}`);
};

module.exports.showFaculty = async(req, res) => {
    const { id } = req.params;
    const faculty = await Faculty.findById(id).populate('author');
    // console.log(faculty);
    if (!faculty) {
        req.flash('error', "Faculty not found!");
        res.redirect('/Faculty');
    }
    res.render('faculty/show', { faculty });
};

module.exports.facultyEditPage = async(req, res) => {
    const { id } = req.params;

    const faculty = await Faculty.findById(id);
    if (!faculty) {
        req.flash('error', "Faculty not found!");
        res.redirect('/Faculty');
    }
    res.render('faculty/edit', { faculty, departments });
};

module.exports.editFaculty = async(req, res) => {
    // if(!req.body.user) next(new expressError('Invalid user data',400));

    const faculty = await Faculty.findByIdAndUpdate(req.params.id, {...req.body.faculty });
    const imgs = req.files.map((img) => ({ url: img.path, filename: img.filename }));
    faculty.image.push(...imgs); // spread
    // console.log(req.body)
    await faculty.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await faculty.updateOne({$pull:{image: {filename:{$in: req.body.deleteImages}}}});
    }
    
    req.flash('success', 'Faculty created Successfully!');
    res.redirect(`/Faculty/${faculty.id}`);
};

module.exports.deleteFaculty = async(req, res) => {
    const { id } = req.params;
    await Faculty.findByIdAndDelete(id);
    req.flash('success', 'Faculty deleted Successfully!');
    res.redirect('/Faculty');
};