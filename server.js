import express from "express";
import session from "express-session";
import userController from "./controllers/users.js";
import classController from "./controllers/classes.js";
import homeController from "./controllers/home.js";
import blogController from "./controllers/blogs.js";
import bookingController from "./controllers/booking.js";



const app = express()
const port = 8080

// TODO: Add middleware here

// Enable the express session middleware, this will allow the website
// to remember users between page reloads and requests
app.use(session({
    secret: "secret phrase",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // change before deploying online
}))

// Enable the ejs view engine
app.set("view engine", "ejs");


// Enable support for URL-encoded request bodies (POST-ed from data)
app.use(express.urlencoded({ 
    extended: true, 
}))

// TODO: Use the controllers here

//Redirect request to root to the user_list page
app.get("/", (request, response) => {
    response.status(301).redirect("/home")
})

// Server static resources
app.use(express.static("static"));

// TODO: Use controller here
app.use(userController);
app.use(classController);
app.use(homeController);
app.use(bookingController);
// app.use(activityController);
app.use(blogController);
// app.use(locationController);



// Start the listening requests
app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}`);
})