const User = require('../models/user');
const {cloudinary} = require('../cloudinaryConfig/index');
const clubs = ['ACM-CSS', 'IEEE', 'PEB', 'DRAMS', 'APC', 'DSA-N-DEV', 'SCC', 'SAASC'];
const departments = ['Electronics and communication Engineering', 'Computer science Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Aerospace Enginnering', 'Production Engineering', 'Metalurgical Engineering'];
module.exports.indexUsers = async(req, res) => {
    const users = await User.find({});
    res.render('users/index', { users });
}

module.exports.newUserPage = async(req, res) => {
    res.render('users/new', { clubs });
}

module.exports.createNewUser = async(req, res, next) => {
    // if(!req.body.user) next(new expressError('Invalid user data',400));

    const user = new User(req.body.user);
    user.image = req.files.map((img) => ({ url: img.path, filename: img.filename })) //files added in req wirth multer
    user.author = req.user._id;

    await user.save();
    // console.log(user);
    req.flash('success', 'User created Successfully!');
    res.redirect(`/Users/${user._id}`);
}

module.exports.showUser = async(req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path: 'remarks',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(user);
    if (!user) {
        req.flash('error', "User not found!");
        res.redirect('/Users');
    }
    res.render('users/show', { user });
}

module.exports.editUserPage = async(req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        req.flash('error', "User not found!");
        res.redirect('/Users');
    }
    // console.log(user.name);
    res.render('users/edit', { user, clubs });
}

module.exports.editUser = async(req, res) => {
    // if(!req.body.user) next(new expressError('Invalid user data',400));

    const user = await User.findByIdAndUpdate(req.params.id, {...req.body.user });
    const imgs = req.files.map((img) => ({ url: img.path, filename: img.filename }));
    user.image.push(...imgs); // spread
    // console.log(req.body)
    await user.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await user.updateOne({$pull:{image: {filename:{$in: req.body.deleteImages}}}});
    }
    
    req.flash('success', 'User Edited Successfully!');
    res.redirect(`/Users/${user.id}`);
}

module.exports.deleteUser = async(req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    req.flash('success', 'User deleted Successfully!');
    res.redirect('/Users');
}