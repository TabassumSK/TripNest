// Import the Express framework (used to build web apps & APIs)
const express = require("express");

// Create an Express application (your main app/server object)
const app = express();

// Import Mongoose (used to connect and work with MongoDB)
const mongoose = require("mongoose");

// Import Node.js 'path' module (helps manage file & folder paths safely)
const path = require("path");

// Import your Listing model (MongoDB schema for storing listings)
const Listing = require("./models/listing");

// Import method-override (lets you use PUT/DELETE in forms where only GET/POST are supported)
const methodOverride = require("method-override");

// Import ejs-mate (adds support for layouts/partials in EJS templates)
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError.js");
// models/review.js
const Review = require("./models/reviews.js");

//user authenticaion-authorisation
const User = require("./models/users.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const { isLoggedIn } = require("./middleware.js");

//routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");

// ------------------- EJS (Template Engine) Settings ------------------- //

// Set EJS as the default template engine
app.set("view engine", "ejs");

// Serve static files (CSS, JS, images) from the "public" folder
// Example: /public/style.css → accessible at http://localhost:3000/style.css
app.use(express.static(path.join(__dirname, "/public")));

// Tell Express where your "views" (EJS templates) are located
// __dirname = current project folder
app.set("views", path.join(__dirname, "views"));

// Parse incoming form data (application/x-www-form-urlencoded)
// So you can use req.body to get form inputs
app.use(express.urlencoded({ extended: true }));

// Allow overriding HTTP methods using ?_method=PUT or ?_method=DELETE
// Example: <form method="POST" action="/listings/1?_method=DELETE">
app.use(methodOverride("_method"));

// Use ejs-mate as the template engine for rendering .ejs files
// This allows you to use   and partials in your templates
app.engine("ejs", ejsMate);

//mongoDB connection with js
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
main()
  .then(() => {
    console.log("server connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

// app.get("/", (req, res) => {
//   res.send("working database");
// });

// ------------------- SESSION CONFIG -------------------
// app.use(
//   session({
//     secret: "thisshouldbeabettersecret", // replace with a strong secret
//     resave: false, // don’t save session if unmodified
//     saveUninitialized: false, // don’t create session until something is stored
//     cookie: {
//       maxAge: 1000 * 60 * 60, // 1 hour
//       secure: false, // true if using HTTPS
//     },
//   })
// );

// //passport use here
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate())); // use static authenticate method of model in LocalStrategy
// passport.serializeUser(User.serializeUser()); // use static serialize and deserialize of model for passport session support
// passport.deserializeUser(User.deserializeUser());

//user login
// app.get("/users", async(req, res) => {
//     const userNm = new User({
//         email : "tavs@gmail.com",
//         username : "tavs"
//     });
//     let registeredUser = await User.register(userNm, "tavss");
//     res.send(registeredUser);
// });

//signup
// app.get("/signup", (req, res) => {
//   res.render("users/signup.ejs");
// });

// app.post(
//   "/signup",
//   wrapAsync(async (req, res) => {
//     const { username, email, password } = req.body;
//     const newUser = new User({ email, username });
//     const registeredUser = await User.register(newUser, password);
//     console.log(registeredUser);
//     res.redirect("/listings");
//   })
// );

//login
// app.get("/login", (req, res) => {
//   res.render("users/login.ejs");
// });

// app.post(
//   "/login",
//   passport.authenticate("local", { failureRedirect: "/login" }),
//   async (req, res) => {
//     res.redirect("/listings");
//   }
// );

//Insert in mongoDB
// app.get("/enterData", async(req, res) => {
//     const list1 = new Listing({
//         title: "villa awesome",
//         description: "Buying own",
//         price: 1234,
//         location: "gorgea",
//         country: "Greenland",
//     });
//     await list1.save();
//     res.send("saved in database");
// });



// if request matching above routes it will executed but if not find route then it will prints "Page Not Found"
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//error handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

//server listening
app.listen(8080, () => {
  console.log(`Server is listening to Port 8080`);
});
