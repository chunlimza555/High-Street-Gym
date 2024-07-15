import express from "express";
import * as Activity from "../models/activity.js";


const activityController = express.Router();

activityController.get("/activity_list", (request, response) => {
    Activity.getAll().then(Activity => {
        response.send(Activity)
    }).catch(error => {
        response.send("Error!", + error)
        
    })
})

export default activityController;