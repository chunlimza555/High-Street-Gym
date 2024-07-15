import {db_conn} from "../database.js";

export function newBlogUser(
        post_id,
        user_id,
        post_title,
        post_datetime,
        post_content,
        user_firstname,
        user_lastname,
        user_password,
        user_role,
        user_email,
        user_phone,
        user_address
) {
    return {
        post_id,
        user_id,
        post_title,
        post_datetime,
        post_content,
        user_firstname,
        user_lastname,
        user_password,
        user_role,
        user_email,
        user_phone,
        user_address
    }
}

export function getAll() {
    return db_conn.query(
        `
        SELECT * FROM blog_posts INNER JOIN users
        ON blog_posts.post_user_id = users.user_id
        
        
    `)
        .then(([queryResult]) => {
            return queryResult.map(
            result => newBlogUser(
                result.post_id,
                result.user_id,
                result.post_title,
                result.post_datetime,
                result.post_content,
                result.user_firstname,
                result.user_lastname,
                result.user_password,
                result.user_role,
                result.user_email,
                result.user_phone,
                result.user_address
                
            )
        )
    });

}

// test

// getAll().then((blogs) => {
//     console.log(blogs)
// })
// test


export function getAllByBlogID(blogID) {
    return db_conn.query(
        `
        SELECT * FROM blog_posts
        INNER JOIN users
        ON blog_posts.post_user_id = users.user_id
        WHERE blog_posts.post_id = ? 
        `,
        [blogID]
    ). then(([queryResult]) => {
        if (queryResult.length > 0) {
            // get the first matching result
            const result = queryResult[0]
        // convert each result into a model object
        return newBlogUser(
                result.post_id,    
                result.user_id,
                result.post_title,
                result.post_datetime,
                result.post_content,
                result.user_firstname,
                result.user_lastname,
                result.user_password,
                result.user_role,
                result.user_email,
                result.user_phone,
                result.user_address
            
        )

        }
        else {
            return Promise.reject("no matching results")
        }
    })
}

//test //

// getAllByBlogID(3).then((blogs) => {
//     console.log(blogs)
// })

//test//


export function getAllByUserID(blogUserID) {
    return db_conn.query(
        `
        SELECT * FROM blog_posts
        INNER JOIN users
        ON blog_posts.post_user_id = users.user_id
        WHERE blog_posts.post_user_id = ? 
    `,
        [blogUserID]
    ).then(([queryResult]) => {
        if (queryResult.length > 0) {
            // get the first matching result
            const result = queryResult[0]
        // convert each result into a model object
        return queryResult.map(
            result => newBlogUser(
                result.post_id,    
                result.user_id,
                result.post_title,
                result.post_datetime,
                result.post_content,
                result.user_firstname,
                result.user_lastname,
                result.user_password,
                result.user_role,
                result.user_email,
                result.user_phone,
                result.user_address
            )
        )
    } else {
        return Promise.reject("no matching results")
    }

    })
}

// test//
// getAllByUserID(2).then((blogs) => {
//     console.log(blogs)
// })
// test//