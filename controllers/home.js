import express from "express";

const homeController = express.Router()

//Control function / route

homeController.get("/home", (request, response) => {
   response.render("home.ejs")
})


homeController.get("/home_users", 
(request, response) => {
   response.render("home_users.ejs")
})


// homeController.get("/our_policy", (request, response) => {
//    response.render("our_policy.ejs")
// })


// homeController.get("/about_us", (request, response) => {
//    response.render("about_us.ejs")
// })


export default homeController