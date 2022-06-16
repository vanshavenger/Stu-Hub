const loginSchema = require("../models/login");

module.exports.register = async(req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const login = new loginSchema({ email, username });
        const registeredLogin = await loginSchema.register(login, password);
        req.login(registeredLogin, (err) => {
            if (err) return next(err);
            else {
                req.flash('success', 'Welcome to Stu-Hub');
                res.redirect('/Users');
            }
        })
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
    // console.log(registeredLogin)
};

module.exports.registerPage = (req, res) => {
    res.render('auth/register.ejs');
};
module.exports.loginPage = (req, res) => {
    res.render('auth/login.ejs');
};
module.exports.login = async(req, res) => {
    req.flash('success', 'Welcome Back');
    const redirect = req.session.returnTo || '/Users';
    delete req.session.returnTo;
    // console.log(redirect);
    res.redirect(redirect);
};

module.exports.logout = (req, res, next) => {
    req.logout();
    req.flash('success', `Successfully logged out, GoodBye,`);
    res.redirect('/Users');
}