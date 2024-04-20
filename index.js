if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}


const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session=require('express-session');
const flash=require('connect-flash');
const  passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');

const userRoutes=require('./routes/user');
const campgroundRoutes=require('./routes/campgrounds')
const reviewRoutes=require('./routes/reviews');
//const { strict } = require("assert");



mongoose.connect("mongodb://localhost:27017/campground");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Dtabase connected");
});

const app = express();

const port = 8080;
// Set EJS as the view engine and use ejs-mate for layouts
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")))


const sessionConfig={
  secret:'thisshouldbeabettersecret',
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize( ));
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  console.log(req.session)
  res.locals.currentUser=req.user;
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  next()
})


app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
app.get("/", (req, res) => {
  res.render("home");
});




app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

//basic error handling
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
