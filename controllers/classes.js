import express from "express";
import * as Classes from "../models/classes.js";
import * as ClassUserActivity from "../models/class-user-activity.js";
import * as BookingClassUser from "../models/booking-class-user.js";
import * as Location from "../models/location.js";
import * as Activity from "../models/activities.js";
import * as User from "../models/users.js";
import access_control from "../access_control.js";

const classController = express.Router();




// Sequence
classController.get("/class_list", (request, response) => {
    if (request.query.search_term) {
        ClassUserActivity.getByClass(request.query.search_term).then( ClassUserActivity => {
            response.render("class_list.ejs", { ClassUserActivity });
        }).catch(error => {
            response.status(500).send("Error!" + error)
        });
    } else if(request.query.search_term_trainer){
        ClassUserActivity.getBySearchNameTrianer(request.query.search_term_trainer)   // Revise
        .then(ClassUserActivity => {
            response.render("class_list.ejs", { 
                ClassUserActivity
                
            })
        }).catch(error => {
            response.render("status.ejs", {
                status: "Database error",
                message: error
            })
            console.error(error)
        }
    )

 } 
    else {
        ClassUserActivity.getAll().then(ClassUserActivity => {
            response.render("class_list.ejs", { ClassUserActivity });
        }).catch(error => {
            response.status(500).send("Error!" + error)
        });
    }
});





// Class calendar
classController.get("/class_timetable", 
(request, response) => {
    const dateWeek= ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();

    const mondayOfThisWeek = new Date();
    mondayOfThisWeek.setDate(today.getDate() - (today.getDay() - 1));

    const sundayOfThisWeek = new Date(mondayOfThisWeek);
    sundayOfThisWeek.setDate(sundayOfThisWeek.getDate() + 6);

    
    const classesByDay = {
        "Monday": [],
        "Tuesday": [],
        "Wednesday": [],
        "Thursday": [],
        "Friday": [],
        "Saturday": [],
        "Sunday": [],
    };

    ClassUserActivity.getByDateRange(mondayOfThisWeek.toISOString().split('T')[0], sundayOfThisWeek.toISOString().split('T')[0])
        .then(classesThisWeek => {
       
            for (const classItem of classesThisWeek) {
                const classDayName = dateWeek[new Date(classItem.class_datetime).getDay()];
                classesByDay[classDayName].push(classItem);
            }

            response.render("class_timetable.ejs", { request, classesByDay });
        })
        .catch(error => {
            console.error("Error retrieving classes:", error);
            response.status(500).send("Internal Server Error");
        });
});



// Manage Class

classController.get("/manage_class", 
access_control(["admin", "trainer"]),
    (request, response) => {
    if(request.query.search_term){
        ClassUserActivity.getBySearchNameTrianer(request.query.search_term)   // Revise
        .then(classes => {
            response.render("manage_class.ejs", { 
                classes,
                accessRole: request.session.user.accessRole 
            })
        }).catch(error => {
            response.render("status.ejs", {
                status: "Database error",
                message: error
            })
            console.error(error)
        }
    )

 }else if(request.query.search_term_date_start, request.query.search_term_date_end){
        ClassUserActivity.getByDateRange(request.query.search_term_date_start, request.query.search_term_date_end)
        .then(classes => {
            response.render("manage_class.ejs", { classes })
        }).catch(error => {
            response.render("status.ejs", {
                status: "Database error",
                message: error
            })
            console.error(error)
        }
    
    )

 }else{

    ClassUserActivity.getAll()
    .then(classes => {
        response.render("manage_class.ejs", { classes })
    }).catch(error => {
        response.render("status.ejs", {
            status: "Database error",
            message: error
        })
        console.error(error)

    }

    )}

});


// Staff Edit

// GET: /class_edit



classController.get("/class_edit", (request, response) => {
    const editClassId = request.query.edit_id; // Renamed to editClassId for clarity
    if (editClassId) {
        let allTrainers, allActivities, allLocations;
        ClassUserActivity.getByClassId(editClassId)
            .then(editClass => {
                return User.getByRole("trainer")
                    .then(trainers => {
                        allTrainers = trainers; // Assign trainers to allTrainers
                        return Activity.getAll()
                            .then(activities => {
                                allActivities = activities; // Assign activities to allActivities
                                return Location.getAll()
                                    .then(locations => {
                                        allLocations = locations;
                                        response.render("manage_class_edit.ejs", {
                                            allTrainers: allTrainers,
                                            allActivities: allActivities,
                                            editClass: editClass[0],
                                            allLocations: allLocations
                                        });
                                    });
                            });
                    });
            })
            .catch(error => {
                response.render("status.ejs", {
                    status: "Can not edit class",
                    message: error
                });
                console.error(error);
            });
    } else {
        let allTrainers, allActivities, allLocations;
        User.getByRole("trainer")
            .then(trainers => {
                allTrainers = trainers; // Assign trainers to allTrainers
                return Activity.getAll()
                    .then(activities => {
                        allActivities = activities; // Assign activities to allActivities
                        return Location.getAll()
                            .then(locations => {
                                allLocations = locations;
                                response.render("manage_class_edit.ejs", {
                                    allTrainers: allTrainers,
                                    allActivities: allActivities,
                                    editClass: {   // Create this one because need to use same name as above function
                                        class_id : 0,
                                        class_name: "",
                                        class_datetime: "",
                                        trainer_id: "",
                                        activity_id: "",
                                        location_id: ""
                                    },
                                    allLocations: allLocations
                                });
                            });
                    });
            })
            .catch(error => {
                response.render("status.ejs", {
                    status: "Can not edit class",
                    message: error
                });
                console.error(error);
            });
    }
});



//confirm edit class
classController.post(
    "/class_edit_confirm", 
    //add access control
    
    (request, response) => {
        const formData = request.body;

        

        if (!/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s?$/.test(formData.class_date)) {
            response.render("status.ejs", {
                status: "Invalid date format",
                message: "The date must be in the format YYYY-MM-DD",
            });
            return;
        }

        // Create const new because time input is not same form between create and update function 

        const editClass = Classes.newClass(
            formData.class_id,
            `${formData.class_date}T${formData.class_time}`,
            formData.location_id,
            formData.activity_id,
            formData.trainer_user_id,
            // request.session.user.userID
  

        )

        if(formData.action === "create"){
            Classes.create(editClass).then(([result]) => {
                response.redirect("/manage_class")
                
            }).catch(error => {
                response.render("status.ejs", {
                    status: "Failed to create",
                    message: "Database failed to create class."
                })
            })

        }else if(formData.action === "update"){
            Classes.update(editClass).then(([result]) => {
                response.redirect("/manage_class")
                
            }).catch(error => {
                response.render("status.ejs", {
                    status: "Failed to update",
                    message: "Database failed to update class."
                })
            })
        }else if(formData.action === "delete"){
            Classes.deleteById(formData.class_id).then(([result]) => {
                response.redirect("/manage_class")
                
            }).catch(error => {
                response.render("status.ejs", {
                    status: "Failed to delete",
                    message: "Database failed to delete class."
                })
            })
        }

});

// // Selection
// classController.get("/class_detail", (request, response) => {
//     const classID = request.query.id;
//     if (classID) {
//         Classes.getById(classID).then(Class => {
//             response.render("class_detail.ejs", { Class });
//         }).catch(error => {
//             response.status(500).send("Error!" + error)
//         });
//     } else {
//         response.status(402).send("Class ID not provided");
//     }
// });

// // Iteration
// classController.get("/class_schedule", (request, response) => {
//     Classes.getAll().then(Classes => {
//         const schedule = [];
//         Classes.forEach(Class => {
//             schedule.push({
//                 class: Class.name,
//                 time: Class.time,
//                 location: Class.location,
//                 activity: Class.activity
//             });
//         });
//         response.render("class_schedule.ejs", { schedule });
//     }).catch(error => {
//         response.status(500).send("Error!" + error)
//     });
// });





  



export default classController;
