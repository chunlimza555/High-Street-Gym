import express, { request } from "express";

import * as User from "../models/users.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import access_control from "../access_control.js";
import validator from "validator";



const userController = express.Router();

//LogIn

userController.get("/login", (request, response) => {
    response.render("login.ejs")
})


userController.post("/login", (request, response) => {
   
    const login_email = request.body.email;
    const login_password = request.body.password;

    User.getByEmail(login_email).then(user =>{
        if (bcrypt.compareSync(login_password, user.password)) {
            request.session.user = {
                userID: user.id,
                accessRole: user.role
            };
            response.redirect("/home_users");
        } else {
            response.render("status.ejs", { status: "Login Failed", message: "Invalid password" });
        }
    }).catch(error => {
        response.render("status.ejs", { status: "E-mail not found", message: error });
    })
 });

 //logout
userController.get("/user_logout", (request, response) => {
    request.session.destroy();
    response.redirect("/");
 });




 // register
userController.get("/register", (request, response) => {
    response.render("register.ejs")
 })
 
 
 userController.post("/register", (request, response) => {
 
    const registerData = request.body;
 
          if (!/[a-zA-Z-]{2,}/.test(registerData.firstname)) {
             response.render("status.ejs", {
                 status: "Invalid first name",
                 message: "First name must be letters",
             });
             return;
         }
 
         if (!/[a-zA-Z-]{2,}/.test(registerData.lastname)) {
             response.render("status.ejs", {
                 status: "Invalid last name",
                 message: "Last name must be letters",
             });
             return;
         }
 
         if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(registerData.email)) {
             response.render("status.ejs", {
                 status: "Invalid email",
                 message: "Email must be a valid email address.",
             });
             return;
         }
 
 
    const registerUser = User.newUser(
        null,
        validator.escape(registerData.email),
        validator.escape(registerData.password),
        "members",
        validator.escape(registerData.phone),
        validator.escape(registerData.firstname),
        validator.escape(registerData.lastname),
        validator.escape(registerData.address)
    
    );
   
    if (!registerUser.password.startsWith("$2a")) {
     registerUser.password = bcrypt.hashSync(registerUser.password);
 }
     
    
    User.create(registerUser).then(([result]) => {
       console.log(result);
        response.redirect("/home_users");
    }).catch(error => {
        response.render("status.ejs", {
            status: "Failed to create",
            message: "Database failed to create product."
        })
    })
 })



// Admin and trianer CRUD


userController.get("/manage_user", 
    access_control(["admin"]), 
    (request, response) => {
    if(request.query.user_role){
        User.getByRole(request.query.user_role)
        .then(users => {
        response.render("manage_user.ejs", 
        { users,
        accessRole: request.session.user.accessRole, 
        })
    }).catch(error => {
        response.render("status.ejs", {
            status: "You did not have permission",
            message: error
        })
        console.error(error)
    }
    )

    }else{ 
    User.getAll()
    .then(users => {
    response.render("manage_user.ejs", { users })
    }).catch(error => {
    response.render("status.ejs", {
        status: "Database error",
        message: error
    })
    console.error(error)
    })

    }

    })



// Admin and trainer CRUD

userController.get("/manage_user", 
    access_control(["admin"]), 
    (request, response) => {
    if(request.query.user_role){
        User.getByRole(request.query.user_role)
        .then(users => {
            response.render("manage_user.ejs", { 
                users,
                accessRole: request.session.user.accessRole, 
            });
        }).catch(error => {
            response.render("status.ejs", {
                status: "You did not have permission",
                message: error.toString()
            });
            console.error(error);
        });
    } else { 
        User.getAll()
        .then(users => {
            response.render("manage_user.ejs", { users });
        }).catch(error => {
            response.render("status.ejs", {
                status: "Database error",
                message: error.toString()
            });
            console.error(error);
        });
    }
});

// CRUD - BY Staff (ADMIN and TRAINER) - Page : selected id or create new
userController.get("/manage_user_edit", 
access_control(["admin"]), 
(request, response) => {
    const editID = request.query.edit_id;
    if (editID) {
        User.getById(editID).then(editUser => {
            response.render("manage_user_edit.ejs", { editUser });
        }).catch(error => {
            response.render("status.ejs", {
                status: "Error",
                message: error.toString()
            });
            console.error(error);
        });
    } else {
        User.getAll().then(allUser => {
            response.render("manage_user_edit.ejs", { 
                allUser,
                editUser: User.newUser(0, "", "", "", "", "", "", "")
            });
        }).catch(error => {
            response.render("status.ejs", {
                status: "Error",
                message: error.toString()
            });
            console.error(error);
        });
    }
});

// CRUD - ALL 
userController.post("/edit_user_action", 
access_control(["admin"]), 
(request, response) => {
    const FormData = request.body;

    // Validation
    if (!/[a-zA-Z-]{2,}/.test(FormData.firstname)) {
        response.render("status.ejs", {
            status: "Invalid first name",
            message: "First name must be letters",
        });
        return;
    }

    if (!/[a-zA-Z-]{2,}/.test(FormData.lastname)) {
        response.render("status.ejs", {
            status: "Invalid last name",
            message: "Last name must be letters",
        });
        return;
    }

    if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(FormData.email)) {
        response.render("status.ejs", {
            status: "Invalid email",
            message: "Email must be a valid email address.",
        });
        return;
    }

    // Create user model from form data
    const editUser = User.newUser(
        FormData.id,
        validator.escape(FormData.email),
        FormData.password, 
        FormData.role,
        validator.escape(FormData.phone),
        validator.escape(FormData.firstname), 
        validator.escape(FormData.lastname),
        validator.escape(FormData.address)
    );

    // Hash the password if it is new
    if (!editUser.password.startsWith("$2a")) {
        editUser.password = bcrypt.hashSync(editUser.password);
    }

    // Determine and execute the C_RUO operation
    if (FormData.action === "create") {
        User.create(editUser).then(([result]) => {
            response.redirect("/manage_user");
        }).catch(error => {
            response.render("status.ejs", {
                status: "Failed to create",
                message: "Database failed to create product."
            });
            console.error(error);
        });
    } else if (FormData.action === "update") {
        User.update(editUser).then(([result]) => {
            response.redirect("/manage_user");
        }).catch(error => {
            response.render("status.ejs", {
                status: "Failed to update",
                message: "Database failed to update product."
            });
            console.error(error);
        });
    } else if (FormData.action === "delete") {
        User.deleteById(editUser.id).then(([result]) => {
            response.redirect("/manage_user");
        }).catch(error => {
            response.render("status.ejs", {
                status: "Failed to delete",
                message: "Database failed to delete product."
            });
            console.error(error);
        });
    }
});



 



export default userController