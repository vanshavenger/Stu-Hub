if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); // jah tak production mei nai hai tabh tak we can see and use key, api of cloudinay
}


const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');

const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const expressError = require('./utilities/expressError');
const session = require('express-session');
const flash = require('connect-flash');

const loginSchema = require('./models/login');
const userRoute = require('./routes/userRoute');
const facultyRoute = require('./routes/facultyRoute');
const remarkRoute = require('./routes/remarkRoute');
const loginRoute = require('./routes/loginRoute');

const passport = require('passport');
const passportLocal = require('passport-local');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/user-portal';
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.log.bind(console, "Connection Erro"));
db.once("open", () => {
    console.log("Database Connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );

  const secret = process.env.SECRET || "thisshouldbeabettersecret";
  
const store = MongoStore.create({ 
    mongoUrl: dbUrl,
    secret:secret,
    touchAfter:24*60*60
});

store.on("error", function(err){
    console.log("session store error",err);
})

const sessionConfig = {
    store: store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // safety
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig));
app.use(flash());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css", // botstrap 5
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
    "https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css",
    "https://cdn.jsdelivr(dot)net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net",
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dskux81xq/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session()); //persisitent login sessions
passport.use(new passportLocal(loginSchema.authenticate())); // statics method inbuilt in passport
passport.serializeUser(loginSchema.serializeUser()) //  seriealization store user in session
passport.deserializeUser(loginSchema.deserializeUser()) // get the stored out of it

//universally
app.use((req, res, next) => { //middleware
    res.locals.success = req.flash('success');
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    next();
})


app.use('/', loginRoute);
app.use('/Users', userRoute);
app.use('/Faculty', facultyRoute);
app.use('/Users/:id/remark', remarkRoute);

app.get('/', (req, res) => {
    res.render('home');
})


app.all('*', (req, res, next) => {
    next(new expressError('Page not found!!', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "OH No Something went wrong";
    res.status(statusCode).render('error.ejs', { err });
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`On Port ${port}`)
})