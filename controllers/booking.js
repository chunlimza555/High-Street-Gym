import express from "express";
import * as Booking from "../models/bookings.js";
import * as Classes from "../models/classes.js";
import * as Location from "../models/location.js";
import * as Activity from "../models/activities.js";
import * as User from "../models/users.js";
import * as BookingClassUser from "../models/booking-class-user.js";
import * as ClassUserActivity from "../models/class-user-activity.js";
import access_control from "../access_control.js";

const bookingController = express.Router();




bookingController.get("/booking", 
access_control(["members", "admin"]),
(request, response) => {
    
        const UserID = request.session.user.userID;
    
        ClassUserActivity.getByClassId(request.query.id)
            .then(bookings => {
                return User.getById(UserID)
                .then(user => {  
                response.render("booking.ejs", { 
                    bookings ,
                    user ,
					UserID,
                    accessRole: request.session.user.accessRole 
                })
            })
            .catch(error => {
                response.render("status.ejs", {
                    status: "Database error",
                    message: error.message || "An error occurred while retrieving bookings."
                });
                console.error(error);
    
    
            })
        })
    })


// For customer create booking 

bookingController.post("/create_booking",
access_control(["members", "admin"]),
(request, response) => {
    if (request.body) {
        let formData = request.body;

        // Log form data to debug
        console.log("Form Data Received:", formData);

        // Validate form data
        const classId = parseInt(formData.booking_class_id, 10);
        console.log("Parsed Class ID:", classId);

        if (isNaN(classId) || classId <= 0) {
            console.error("Invalid class ID:", formData.booking_class_id);
            return response.render("status.ejs", {
                status: "Invalid class ID",
                message: "Please select a valid class."
            });
        }

        // Create a new booking object with form data
        const newBooking = Booking.newBooking(
            null,
            request.session.user.userID,
            classId,  // Ensure class_id is an integer
            new Date().toISOString().slice(0, 19).replace('T', ' '),  // Current date and time in MySQL format
            formData.user_firstname,
            formData.user_lastname,
            formData.activity_name
        );

        // Log new booking object to debug
        console.log("New Booking Object:", newBooking);

        // Create new booking
        Booking.create(newBooking)
            .then(([result]) => {
                response.redirect("/create_booking?user_id=" + newBooking.user_id);  // Redirect to booking page with user ID
            })
            .catch((error) => {
                console.error("Error creating booking:", error);
                response.render("status.ejs", {
                    status: "Failed to book class",
                    message: "Booking failed to create, please contact staff."
                });
            });
    } else {
        response.render("status.ejs", {
            status: "No form data received",
            message: "No form data received, please try again."
        });
    }
});






// Get All Bookings
bookingController.get("/create_booking", 
access_control(["members", "admin"]),
(request, response) => {
    const userId = request.session.user.userID;
    BookingClassUser.getAllByUserID(userId)
        .then(bookings => {
            return User.getById(userId)
        .then(user => {
            response.render("create_booking.ejs", { 
                bookings, 
                user,
				UserID: userId,
				accessRole: request.session.user.accessRole
			});
        })
        })
        .catch(error => {
            response.render("status.ejs", {
                status: "Database error",
                message: error.message || "An error occurred while retrieving bookings."
            });
            console.error(error);
        });
});


bookingController.get("/delete_booking_user", (request, response) => {
    BookingClassUser.getAllByBookingID(request.query.id)
        .then(editBooking => {
            response.render("delete_booking_user.ejs", {
                editBooking
            });
        })
        .catch(error => {
            response.render("status.ejs", {
                status: "Database error",
                message: error
            });
            console.error(error);
        });
});

//For customer delete booking 
bookingController.post(
    "/delete_booking_user_confirm",
    (request, response) => {
    const formData = request.body;

    const classId = parseInt(formData.class_id, 10);

    const editBooking = Booking.newBooking(
        formData.booking_id,
        formData.booking_user_id,
        classId,  // Ensure class_id is an integer
        new Date().toISOString().slice(0, 19).replace('T', ' '),  // Current date and time in MySQL format
        formData.user_firstname,
        formData.user_lastname,
        formData.activity_name
    );

    // if (formData.action === "create") {
    //     Booking.create(editBooking).then(([result]) => {
    //         response.redirect("/create_booking?user_id=" + editBooking.user_id);
    //     }).catch(error => {
    //         response.render("status.ejs", {
    //             status: "Failed to create",
    //             message: "Database failed to create booked."
    //         });
    //     });

     if (formData.action === "delete") {
        Booking.deleteById(editBooking.id).then(([result]) => {
            response.redirect("/create_booking?user_id=" + editBooking.user_id);
        }).catch(error => {
            response.render("status.ejs", {
                status: "Failed to delete",
                message: "Database failed to delete booked"
            });
        });
    }
});


// Manage Bookings


bookingController.get("/manage_booking", 
access_control(["admin"]), 
(request, response) => {
	const searchTerm = request.query.search_term;

	if (searchTerm) {
		// If there's a search term, use getBySearchTerm
		BookingClassUser.getBySearchTerm(searchTerm)
			.then((bookings) => {
				response.render("manage_booking.ejs", {
					bookings: bookings,
					accessRole: request.session.user.accessRole,
				});
			})
			.catch((error) => {
				console.error("Database error:", error);
				response.render("status.ejs", {
					status: "Database error",
					message: error.message || "An error occurred while fetching data.",
				});
			});
	} else {
		// If no search term, get everything
		BookingClassUser.getEverything()
			.then((bookings) => {
				response.render("manage_booking.ejs", {
					bookings: bookings,
					accessRole: request.session.user.accessRole,
				});
			})
			.catch((error) => {
				console.error("Database error:", error);
				response.render("status.ejs", {
					status: "Database error",
					message: error.message || "An error occurred while fetching data.",
				});
			});
	}
});



// Edit Bookings
bookingController.get("/booking_edit", (request, response) => {
	const editBookingId = request.query.edit_id;

	if (editBookingId) {
		let allActivities, allTrainers;

		BookingClassUser.getAllByBooking(editBookingId)
			.then((editBooking) => {
				return Activity.getAll()
					.then((activities) => {
						allActivities = activities;
						return User.getByRole("trainer");
					})
					.then((trainers) => {
						allTrainers = trainers;
						response.render("manage_booking_edit", {
							editBooking,
							allActivities,
							allTrainers,
						});
					});
			})
			.catch((error) => {
				console.error("Database error:", error);
				response.render("status", {
					status: "Database error",
					message: error.message || "An error occurred while fetching data.",
				});
			});
	} else {
		let allUsers, allClasses;

		User.getAll()
			.then((users) => {
				allUsers = users;
				return Classes.getAll();
			})
			.then((classes) => {
				allClasses = classes;
				response.render("manage_booking_edit", {
					allUsers,
					allClasses,
					editBooking: {
						booking_id: "",
						class_id: "",
						user_id: "",
						class_datetime: "",
						activity_id: "",
						location_name: "",
						class_trainer_user_id: "",
						user_firstname: "",
						user_lastname: "",
					},
					allActivities: [],
					allTrainers: [],
				});
			})
			.catch((error) => {
				console.error("Error:", error);
				response.render("status", {
					status: "Error",
					message: "Failed to fetch all users and classes.",
				});
			});
	}
});

bookingController.post("/booking_edit", (request, response) => {
    const formData = request.body;

    console.log('Form data:', formData);

    const editBooking = Booking.newBooking(
        formData.booking_id,
        formData.user_id,
        formData.class_id,
        new Date().toISOString().slice(0, 19).replace("T", " ")
    );

    // const newBooking = Booking.newBooking(
    //     null,
    //     formData.user_id,
    //     formData.class_id,
    //     new Date().toISOString().slice(0, 19).replace("T", " ")
    // );

    if (formData.action === "create") {
        Booking.create(newBooking)
            .then(([result]) => {
                response.redirect("/manage_booking");
            })
            .catch((error) => {
                console.error("Error creating booking:", error);
                response.render("status", {
                    status: "Failed to create",
                    message: "Database failed to create booking.",
                });
            });
    } else if (formData.action === "update") {
        Booking.update(editBooking)
            .then(([result]) => {
                response.redirect("/manage_booking");
            })
            .catch((error) => {
                console.error("Error updating booking:", error);
                response.render("status", {
                    status: "Failed to update",
                    message: "Database failed to update booking.",
                });
            });
    } else if (formData.action === "delete") {
        Booking.deleteById(formData.id)
            .then(([result]) => {
                response.redirect("/manage_booking");
            })
            .catch(error => {
                console.error("Error deleting booking:", error);
                response.render("status", {
                    status: "Failed to delete",
                    message: error.message || error,
                });
            });
    }
});

// Create Booking

bookingController.get("/booking_create", (request, response) => {
	const { user_id, booking_id } = request.query;
    
	if (user_id && booking_id) {
		let allUsers, allClasses, createBookingData;
		BookingClassUser.getAllByUserID(user_id)
        
			.then((data) => {
				createBookingData = data;
				return Booking.getById(booking_id);
			})
			.then((booking) => {
				Object.assign(createBookingData, booking);
				return User.getById(user_id);
			})
			.then((users) => {
				allUsers = users;
				return BookingClassUser.getAll();
			})
			.then((classes) => {
				console.log(classes);
				allClasses = classes;
				response.render("manage_booking_create.ejs", {
					allUsers,
					allClasses,
					createBooking: createBookingData,
					user_id: user_id,
					booking_id: booking_id,
				});
			})
			.catch((error) => {
				response.render("status.ejs", {
					status: "Error",
					message: "Failed to fetch all users and classes.",
				});
			});
	} else {
		let allUsers, allClasses;
		User.getByRole("members")
			.then((users) => {
				allUsers = users;
				return BookingClassUser.getAll();
			})
			.then((classes) => {
				allClasses = classes;
				response.render("manage_booking_create.ejs", {
					allUsers,
					allClasses,
					createBooking: { user_id: 0 },
					booking_id,
					user_id : 0,
	
				});
			})
			.catch((error) => {
				response.render("status.ejs", {
					status: "Error",
					message: "Failed to fetch all users and classes.",
				});
			});
	}
});

// POST route to handle the booking creation
bookingController.post("/booking_create", (request, response) => {
	const FormData = request.body;

	if (FormData.action === "create") {
		const NewBooking = Booking.newBooking(
			null,
			FormData.user_id,
			FormData.class_id,
			new Date().toISOString().slice(0, 19).replace("T", " ")
		);

		Booking.create(NewBooking)
		.then(([result]) => {
			// return Classes.updateClassAvailabilityById(FormData.class_id, -1)
			
				response.redirect("/manage_booking");
			
			
		})
		.catch(error => {
			console.error("Failed to create booking:", error);
			response.render("status.ejs", {
				status: "Failed to create",
				message: "Database failed to create booked."
			});
		});


	} else if (FormData.action === "update") {
		const editBooking = Booking.newBooking(
			FormData.booking_id,
		    FormData.user_id,
            FormData.class_id,
		    new Date().toISOString().slice(0, 19).replace("T", " ")
		);

		Booking.update(editBooking).then(() =>		
            response.redirect("/manage_booking")
        )
	
		.catch(error => {
			console.error("Failed to update booking:", error);
			response.render("status.ejs", {
				status: "Failed to update",
				message: "Database failed to update booked."
			});
		});
	}
});





// bookingController.get("/manage_booking",
//     // access_control(["admin"]), 
//     (request, response) => {
//         if (request.query.search_term) {
//             let allClasses;
//             BookingClassUser.getBySearch(request.query.search_term)
//                 .then(bookings => {
//                     if (bookings.length > 0) {
//                         return BookingClassUser.getByClassId(bookings[0].class_id)
//                             .then(classes => {
//                                 allClasses = classes;     
//                                 response.render("manage_booking.ejs", { bookings, allClasses });
//                             });
//                     } else {
//                         response.render("manage_booking.ejs", { bookings: [], allClasses: [] });
//                     }
//                 })
//                 .catch(error => {
//                     response.render("status.ejs", {
//                         status: "Database error",
//                         message: error
//                     });
//                     console.error(error);
//                 });
//         } else {
//             BookingClassUser.getAll()
//                 .then(bookings => {
//                     let allClasses = bookings.length > 0 ? bookings[0] : [];
//                     response.render("manage_booking.ejs", { bookings, allClasses });
//                 })
//                 .catch(error => {
//                     response.render("status.ejs", {
//                         status: "Database error",
//                         message: error
//                     });
//                     console.error(error);
//                 });
//         }
//     }
// );




  








export default bookingController;






