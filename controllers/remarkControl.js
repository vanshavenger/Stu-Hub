const User = require('../models/user');
const Remark = require('../models/remark');

module.exports.createRemark = async(req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const remark = new Remark(req.body.remark);
    remark.author = req.user._id;
    user.remarks.push(remark);
    await remark.save();
    await user.save();
    req.flash('success', 'Remark posted Successfully!');
    res.redirect(`/Users/${user.id}`);
}

module.exports.deleteRemark = async(req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, { $pull: { remarks: req.params.remarkid } });
    await Remark.findByIdAndDelete(req.params.remarkid);
    req.flash('success', 'Remark deleted Successfully!');
    res.redirect(`/Users/${user.id}`);
}