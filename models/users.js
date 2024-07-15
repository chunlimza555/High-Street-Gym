import { db_conn} from "../database.js";

// This files job is to represent (model) the users table in the database.

export function newUser(id, email, password, role, phone, firstname, lastname, address) {
    return {
        id,
        email, 
        password, 
        role, 
        phone, 
        firstname, 
        lastname, 
        address
    }
}

// TODO: Create
/*
* Insert a new user object into the database
* @param {*} user - user model object created with newUser()
* @returns - Database result
*/
export function create(user) {
    return db_conn.query(`
    INSERT INTO users (user_email, user_password, user_role, user_phone, user_firstname, user_lastname, user_address) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [user.email, user.password, user.role, user.phone, user.firstname, user.lastname, user.address])
}


// This is a function definition (this is where the function is model)
// function hello(){}

// This is a function call (or calling the function) i.e. where it is used.
// hello()

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////
// const user1 = newUser(null, 'eample@example.com', 'abc123', 'admin', '041-2584563', 'Test', 'Passed', '25 wharf st., brisbane, QLD 4000')

// create(user1)



// TODO: Read - all, by id, by search, ...many kinds....

export function getAll() {
    return db_conn.query(`SELECT * FROM users`)
        .then(([queryResult]) => {
            // convert each result into a model object
            return queryResult.map(
                    result => newUser(
                    result.user_id,
                    result.user_email, 
                    result.user_password, 
                    result.user_role, 
                    result.user_phone, 
                    result.user_firstname, 
                    result.user_lastname, 
                    result.user_address
                        
                )
            )
        })
}

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// getAll().then(allUser =>{
//     console.log(allUser)
// }) //use this code to test


// const allStaff = getAll()

// console.log(allStaff) 


//////////////////////////////////////////////////////////////////

export function getById(userID) {
    return db_conn.query(`SELECT * FROM users WHERE user_id = ?`, [userID])
    .then(([queryResult]) => {
        // check that at least 1 match was found
        if (queryResult.length > 0) {
            // get the first matching result
            const result = queryResult[0]

            // convert result into a model object
            return newUser(
                result.user_id,
                result.user_email, 
                result.user_password, 
                result.user_role, 
                result.user_phone, 
                result.user_firstname, 
                result.user_lastname, 
                result.user_address
            )
        } else {
            // Handle if no matches
            return Promise.reject("no matching results")
        }

    })
}

export function getByEmail(email) {
    return db_conn.query(`SELECT * FROM users WHERE user_email = ?`, [email])
        .then(([queryResult]) => {
            // check that at least 1 match was found
            if (queryResult.length > 0) {
                // get the first matching result
                const result = queryResult[0]

                // convert result into a model object
                return newUser(
                    result.user_id,
                    result.user_email, 
                    result.user_password, 
                    result.user_role, 
                    result.user_phone, 
                    result.user_firstname, 
                    result.user_lastname, 
                    result.user_address
                )
            } else {
                // Handle if no matches
                return Promise.reject("no matching results")
            }

        })
}


///testing//

// getById("2").then((user) => {
//     console.log(user)
// })

//testing//








export function getByFirstname(firstname) {
    return db_conn.query(`SELECT * FROM users WHERE user_firstname = ?`, [firstname])
        .then(([queryResult]) => {
            // check that at least 1 match was found
            if (queryResult.length > 0) {
                // get the first matching result
                const result = queryResult[0]

                // convert result into a model object
                return queryResult.map(   //in case result more than 1 need to use this one to show all result
                    result => newUser(
                        result.user_id,
                        result.user_email, 
                        result.user_password, 
                        result.user_role, 
                        result.user_phone, 
                        result.user_firstname, 
                        result.user_lastname, 
                        result.user_address
                )
            )
            } else {
                // Handle if no matches
                return Promise.reject("no matching results")
            }

        })
}


//test //

// getByFirstname("Jack").then((user) => {
//     console.log(user)
// })

//test //

export function getBySearch(searchTerm) {
    return db_conn.query(
        `SELECT * FROM users WHERE (user_firstname LIKE ? OR user_lastname LIKE ? OR user_email LIKE ?)`,
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`],
    ).then(([queryResult]) => {
        // convert each result into a model object
        return queryResult.map(
            result => newUser(
                result.user_id,
                result.user_email, 
                result.user_password, 
                result.user_role, 
                result.user_phone, 
                result.user_firstname, 
                result.user_lastname, 
                result.user_address
            )
        )

    })
}

//test//

// getBySearch("Nakarin").then((users) => {
//     console.log(users)
// })

// test //


export function getByRole(role) {
    return db_conn.query(`SELECT * FROM users WHERE user_role = ?`, [role])
        .then(([queryResult]) => {
            // check that at least 1 match was found
            if (queryResult.length > 0) {
                // get the first matching result
                const result = queryResult[0]

                // convert result into a model object
                return queryResult.map(   //in case result more than 1 need to use this one to show all result
                    result => newUser(
                        result.user_id,
                        result.user_email, 
                        result.user_password, 
                        result.user_role, 
                        result.user_phone, 
                        result.user_firstname, 
                        result.user_lastname, 
                        result.user_address
                    )
                )
            } else {
                return Promise.reject("no matching results")
            }

        })
}



// // Test //
    
// getByRole("trainer").then((users) => {
//     console.log(users)
// })

//Test // 




// TODO: Update

export function update(user) {
    return db_conn.query(
        `
            UPDATE users
            SET user_email = ?, user_password = ?, user_role = ?, user_phone = ?, user_firstname = ?, user_lastname = ?, user_address = ?
            WHERE user_id = ?
        `,
        [user.email, user.password, user.role, user.phone, user.firstname, user.lastname, user.address, user.id]
    )
}


//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// const user1 = newUser(9, "mmm@gmail.com", "abc555", "members", "0413111111", "YUI", "Toy", "20 Brisbane QLD")

// update(user1);

//////////////////////////////////////////////////////////////////


// TODO: Delete
export function deleteById(userID) {
    return db_conn.query(`DELETE FROM users WHERE user_id = ?`, [userID]);
    
}

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// deleteById(9).then(()=> console.log("Delete operation completed!"))

//////////////////////////////////////////////////////////////////
