const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema,reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');


const campgrounds=require('./routes/campgrounds');
const reviews=require('./routes/reviews');

  mongoose.connect('mongodb://127.0.0.1:27017/new-yelp-camp-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
app.use(express.static(path.join(__dirname,'public')))


app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)

app.get('/', (req, res) => {
  res.render('home')
});




app.all('*', (req, res, next) => {
  next(new ExpressError('page not found', 404))
})

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

app.listen(3000, () => {
  console.log("serving on port 3000")
})