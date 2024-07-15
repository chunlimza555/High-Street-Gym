import express from "express";
import * as Blog from "../models/blog_posts.js";
import * as BlogUser from "../models/blog-user.js";
import access_control from "../access_control.js";
import validator from "validator";


const blogController = express.Router();


// Control Function
blogController.get("/blog", (request, response) => 
    Blog.getAll()
    .then(blogs => {
        response.render("blog.ejs", { blogs })
    }).catch(error => {
        response.render("status.ejs", {
            status: "Database error",
            message: error
        })
        console.error(error)
    }

))



/// User Blog
blogController.get("/blog_user", 
access_control(["members", "admin", "trainer"]),
(request, response) => {
    const UserID = request.session.user.userID;
    BlogUser.getAllByUserID(UserID)
    .then(blogs => {
        response.render("blog_user.ejs", { 
            blogs,
            UserID: UserID,
            accessRole: request.session.user.accessRole 
        })
    }).catch(error => {
        response.render("status.ejs", {
            status: "No blogs",
            message: error
        })
        console.error(error)
    }

    )
})


// For user create their own blog


// blogController.get("/blog_create",
//  access_control(["customer", "admin", "trainer"]),
//   (request, response) => {
//     response.render("blog_create.ejs", {
//         accessRole : request.session.user.accessRole
//     })

// })

blogController.get("/blog_create", 
(request, response) => {
        response.render("blog_create.ejs", { 
        }
    )
})


// user create blog
blogController.post("/blog_create_confirm",(request,response) => {

    const FormData = request.body
    const editBlog = Blog.newPost (
        null,
        request.session.user.userID,    
        FormData.blog_name,
        (new Date().toISOString().slice(0, 19).replace('T', ' ')),
        FormData.blog_detail
        
        
    );

    if(FormData.action === "create"){
        Blog.create(editBlog).then(([result]) => {
            response.redirect("/blog_user?id="+ editBlog.user_id)
            
        }).catch(error => {
            response.render("status.ejs", {
                status: "Failed to create blog",
                message: "WRONGGGGGGG"
            })
        })

    }

})
    
    




// For user select : delete blog 


blogController.get("/blog_user", 
access_control(["members", "admin", "trainer"]), 
(request, response) => {
	const UserID = request.session.user.userID;
	if (UserID) {
		BlogUser.getAllByUserID(UserID)
		
			.then((blogs) => {
				response.render("blog_user.ejs", {
					blogs,
					accessRole: request.session.user.accessRole,
					UserID: UserID,
				});
			})
			.catch((error) => {
				console.error(error);
				response.render("status.ejs", {
					status: "No blogs",
					message: error,
				});
				console.error(error);
			});
	} else {
		response.render("status.ejs", {
			status: "Not found your post",
			message: error,
		});
	}
});




blogController.get("/blog_user_delete", (request, response) => {
    const blogID = request.query.id;
    // console.log('Blog ID to delete:', blogID); // Log blog ID for debugging

    BlogUser.getAllByBlogID(blogID)
        .then((editBlog) => {
            if (!editBlog) {
                throw new Error('No matching results');
            }
            // console.log('Blog to delete:', editBlog); // Log retrieved blog for debugging
            response.render("blog_user_delete.ejs", { editBlog });
        })
        .catch((error) => {
            console.error('Error fetching blog by ID:', error.message); // Detailed error log
            response.render("status", {
                status: "Database error",
                message: error.message,
            });
        });
});



blogController.get("/blog_user_delete_confirm", (request, response) => {
	const FormData = request.query;

	const editBlog = Blog.newPost(FormData.post_id, FormData.user_id);

	Blog.deleteById(editBlog.post_id)
		.then(([result]) => {
			console.log("Debug1: On delete Status", result, editBlog);
			response.redirect("/blog_user?post_user_id=" + editBlog.user_id);
		})
		.catch((error) => {
			response.render("status.ejs", {
				status: "Failed to create",
				message: "Database failed to delete blog",
			});
		});
});



// For user delete blog

// blogController.get("/admin_blog", 
// // access_control(["admin"]), 
// (request, response) => {
    
// 	BlogUser.getAll()
// 		.then((blogs) => {
// 			response.render("admin_blog.ejs", { blogs, accessRole: request.session.user.accessRole });
// 		})
// 		.catch((error) => {
// 			response.render("status.ejs", {
// 				status: "Database error",
// 				message: error,
// 			});
// 			console.log(error);
// 		});
// });

// blogController.get("/delete_blog_admin", (request, response) => {
// 	BlogUser.getAllByBlogID(request.query.id)
// 		.then((editBlog) => {
// 			response.render("blog_delete_admin.ejs", { editBlog });
// 		})
// 		.catch((error) => {
// 			response.render("status.ejs", {
// 				status: "Database error",
// 				message: error,
// 			});
// 			console.log(error);
// 		});
// });







blogController.post("/blog_user_delete_confirm", (request, response) => {
	const FormData = request.body;
    console.log(FormData.post_title);  // Logs the title
    console.log(FormData.post_content);

	//Validation post title
	if (!/[a-zA-Z-]{2,}/.test(FormData.post_title)) {
		response.render("status.ejs", {
			status: "Incorrect blog title",
			message: "Blog title must be letters",
		});
		return;
	}
	
	// Validation post content
	if (!/^\S+$/.test(FormData.post_content)) {
		
		response.render("status.ejs", {
			status: "Invalid blog content",
			message: "Blog content must be letters",
		});
		return;
	}
    
	const editBlog = Blog.newPost(
		FormData.post_id,
		FormData.post_user_id,
		validator.escape(FormData.post_title),
        new Date().toISOString().slice(0, 19).replace('T', ' '),
		validator.escape(FormData.post_content)
		
	);

	if (FormData.action === "create") {
		Blog.create(editBlog)
			.then(([result]) => {
				response.redirect("/blog_user");
			})
			.catch((error) => {
				response.render("status.ejs", {
					status: "Failed to create",
					message: "Database failed to create blog.",
				});
			});
	} else if (FormData.action === "delete") {
        
		Blog.deleteById(editBlog.id)
			.then(([result]) => {
				response.redirect("/blog_user");
			})
			.catch((error) => {
				response.render("status.ejs", {
					status: "Failed to create",
					message: "Database failed to delete blog",
				});
			});
	}
});




// Manage blog

blogController.get("/manage_blog",
access_control(["admin"]),
(request, response) => {
BlogUser.getAll()
.then(blogs => {
	response.render("manage_blog.ejs", 
	{ blogs,
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

});


blogController.get("/delete_blog_manage", (request, response) => {
    BlogUser.getAllByBlogID(request.query.id)
    .then(editBlog => {
        response.render("manage_blog_delete.ejs", { editBlog })
    }).catch(error => {
        response.render("status.ejs", {
            status: "Database error",
            message: error
        })
        console.error(error)
    }

    )
 });


 blogController.post("/manage_blog_delete_confirm", (request, response) => {
    const FormData = request.body;

    console.log('FormData:', FormData); // Log form data to debug

    // Access form data correctly
    const title = FormData.post_title || "";
    const content = FormData.post_content || "";

    if (!/[a-zA-Z-]{2,}/.test(title)) {
        response.render("status.ejs", {
            status: "Invalid blog name",
            message: "Blog name must be letters",
        });
        return;
    }

    // Allow any non-empty string for content, including whitespace
    if (!content.trim()) {
        response.render("status.ejs", {
            status: "Invalid blog detail",
            message: "Blog detail must not be empty",
        });
        return;
    }

    const editBlog = Blog.newPost(
        FormData.post_id,
        FormData.user_id,
        validator.escape(title),
        (new Date().toISOString().slice(0, 19)),
        validator.escape(content.trim()),
        FormData.user_firstname,
        FormData.user_lastname
    );

    if (FormData.action === "create") {
        Blog.create(editBlog).then(([result]) => {
            response.redirect("/manage_blog");
        }).catch(error => {
            response.render("status.ejs", {
                status: "Failed to create",
                message: "Database failed to create blog."
            });
        });

    } else if (FormData.action === "delete") {
        Blog.deleteById(editBlog.id).then(([result]) => {
            response.redirect("/manage_blog");
        }).catch(error => {
            response.render("status.ejs", {
                status: "Failed to delete",
                message: "Database failed to delete blog"
            });
        });
    }
});

//  blogController.post("/manage_blog_delete_confirm", (request, response) => {
//     const FormData = request.body;

// 	console.log('FormData:', FormData); // Log form data to debug


//     // Access form data correctly
   
//     if (!/[a-zA-Z-]{2,}/.test(FormData.post_title)) {
//         response.render("status.ejs", {
//             status: "Invalid blog name",
//             message: "Blog name must be letters",
//         });
//         return;
//     }

//     if (!/^\S+$/.test(FormData.post_content)) {
//         response.render("status.ejs", {
//             status: "Invalid blog detail",
//             message: "Blog detail must be letters",
//         });
//         return;
//     }

//     const editBlog = Blog.newPost(
//         FormData.id,
//         FormData.user_id,
//         validator.escape(title),
//         (new Date().toISOString().slice(0, 19)),
//         validator.escape(content),
//         FormData.user_firstname,
//         FormData.user_lastname
//     );

//     if (FormData.action === "create") {
//         Blog.create(editBlog).then(([result]) => {
//             response.redirect("/manage_blog");
//         }).catch(error => {
//             response.render("status.ejs", {
//                 status: "Failed to create",
//                 message: "Database failed to create blog."
//             });
//         });

//     } else if (FormData.action === "delete") {
//         Blog.deleteById(editBlog.id).then(([result]) => {
//             response.redirect("/manage_blog");
//         }).catch(error => {
//             response.render("status.ejs", {
//                 status: "Failed to delete",
//                 message: "Database failed to delete blog"
//             });
//         });
//     }
// });












export default blogController;
