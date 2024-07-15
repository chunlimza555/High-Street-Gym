import { db_conn} from "../database.js";

// This files job is to represent (model) the users table in the database.

export function newPost(id, user_id, title, datetime, content, user_firstname, user_lastname) {
    return {
        id,
        user_id,
        title,
        datetime,
        content,
        user_firstname, 
        user_lastname
    }
}

// TODO: Create
/*
* Insert a new user object into the database
* @param {*} user - user model object created with newUser()
* @returns - Database result
*/
export function create(post) {
    return db_conn.query(
        `
            INSERT INTO blog_posts (post_user_id, post_title, post_datetime, post_content) 
            VALUES (?,?,?,?)
        `,
        [post.user_id, post.title, post.datetime, post.content]
        
    );
}

// This is a function definition (this is where the function is model)
// function hello(){}

// This is a function call (or calling the function) i.e. where it is used.
// hello()

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////
// const post1 = newPost(null, 1, 'title', '2024-05-09 15:30:00', 'content-test')

// create(post1)

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// TODO: Read - all, by id, by search, ...many kinds....

export function getAll() {
    return db_conn.query(`SELECT *  FROM blog_posts JOIN users ON blog_posts.post_user_id = users.user_id`)
        .then(([queryResult]) => {
            // convert each result into a model object
            return queryResult.map(
                    result => newPost(
                    result.post_id,
                    result.post_user_id,
                    result.post_title,
                    result.post_datetime,
                    result.post_content,
                    result.user_firstname,
                    result.user_lastname,
                )
            )
        })
}

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// getAll().then(allPost =>{
//     console.log(allPost)
// }) //use this code to test


// const allStaff = getAll()

// console.log(allStaff) 


//////////////////////////////////////////////////////////////////

export function getById(id) {
    return db_conn.query(`SELECT * FROM blog_posts WHERE post_id = ?`, [id])
      .then(([queryResult]) => {
        // Check that at least one match was found
        if (queryResult.length > 0){
        // Get the first matching row
          const result = queryResult[0]
  
        // Convert row to Javascript object
          return newPost(
            result.post_id,
            result.post_user_id,
            result.post_title,
            result.post_datetime,
            result.post_content
          )
        } else {
          // TODO: Handle of no matches!
          return Promise.reject("NO matching results")
        }
      })
  }

/// test ///
// getById(1).then((post) => {
//     console.log(post)
// })

// test ///



export function getByUserId(user_id) {
    return db_conn.query(`SELECT * FROM blog_posts WHERE post_user_id = ?`, [user_id])
        .then(([queryResult]) => {
            // check that at least 1 match was found
            if (queryResult.length > 0) {
                // get the first matching result
                const result = queryResult[0]

                // convert result into a model object
                return newPost(
                    result.post_id,
                    result.post_user_id,
                    result.post_title,
                    result.post_datetime,
                    result.post_content
                )
            } else {
                // Handle if no matches
                return Promise.reject("no matching results")
            }

        })
}

/// test ///
// getByUserId(1).then((post) => {
//     console.log(post)
// })

// test ///


// TODO: Update

export function update(post) {
    return db_conn.query(
        `
        UPDATE blog_posts
        SET post_user_id = ?, post_title = ?, post_datetime = ? ,post_content = ?
        WHERE post_id = ?
        `,
        [post.user_id, post.title, post.datetime, post.content, post.id]
    )
}


//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// const post1 = newPost(4, '3', 'title', '2024-05-09 15:30:00', 'content22')

// update (post1)

//////////////////////////////////////////////////////////////////


// TODO: Delete
export function deleteById(postID) {
    return db_conn.query(`DELETE FROM blog_posts WHERE post_id = ?`, [postID]);
    
}

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// deleteById(19).then(()=> console.log("Delete operation completed!"))

//////////////////////////////////////////////////////////////////
