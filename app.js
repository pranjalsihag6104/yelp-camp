if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

console.log(process.env.SECRET);

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://127.0.0.1:27017/new-yelp-camp-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,

})


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connnection error:"));
db.once("open", () => {
  console.log("database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
  secret: 'thishouldbeasecret',
  resave: false,
  saveuninitialised: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  //console.log(req.session)
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.get('/fakeUser', async (req, res) => {
  const user = new User({ email: 'hi@gmail.com', username: 'coltt' });
  const newUser = await User.register(user, 'chicken');
  res.send(newUser);

})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
  res.render('home')
});




// app.all('*', (req, res, next) => {
//   next(new ExpressError('page not found', 404))
// })

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'oh no something went wrong'
  res.status(statusCode).render('error', { err });
});

// app.use((req, res, next) => {
//   console.log('Request Params:', req.params);
//   console.log('Request Query:', req.query);
//   console.log('Request Body:', req.body);
//   next();
// });

app.all('*', (req, res, next) => {
  req.flash('error', 'campground not found');
  res.redirect('/campgrounds'); // Redirect instead of sending a 404 error page
});


app.listen(process.env.PORT|| 3001, () => {
  console.log("serving on port 3000")
})