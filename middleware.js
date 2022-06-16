const User = require('./models/user');
const Faculty = require('./models/faculty');
const { userSchema, facultySchema, remarkSchema } = require('./schmeas');
const expressError = require('./utilities/expressError');
const Remark = require('./models/remark');
module.exports.isLoggedin = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthorU = async(req, res, next) => { // middle ware toc check whether the user is author or not
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to do that');
        return res.redirect(`/Users/${id}`);
    }
    next();
}

module.exports.isAuthorF = async(req, res, next) => {
    const { id } = req.params;
    const faculty = await Faculty.findById(id);
    if (!faculty.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to do that');
        return res.redirect(`/Faculty/${id}`);
    }
    next();
}

module.exports.validateUsers = (req, res, next) => {

    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(er => er.message).join(',')
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateFaculty = (req, res, next) => {

    const { error } = facultySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(er => er.message).join(',')
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateRemarks = (req, res, next) => {

    const { error } = remarkSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(er => er.message).join(',')
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isRemarkAuthor = async(req, res, next) => {
    const { id, remarkid } = req.params;
    const remark = await Remark.findById(remarkid);
    if (!remark.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to do that');
        return res.redirect(`/Users/${id}`);
    }
    next();
}