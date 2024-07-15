import { db_conn} from "../database.js";

// This files job is to represent (model) the users table in the database.

export function newLocation(id, location_name) {
    return {
        id,
        location_name
    }
}

// TODO: Create
/*
* Insert a new user object into the database
* @param {*} user - user model object created with newUser()
* @returns - Database result
*/
export function create(location) {
    return db_conn.query(
        `
            INSERT INTO location (location_name) 
            VALUES (?)
        `,
        [location.location_name]
        
    );
}

// This is a function definition (this is where the function is model)
// function hello(){}

// This is a function call (or calling the function) i.e. where it is used.
// hello()

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////
// const location1 = newLocation(null, 'TAFE South Bank')

// create(location1)



// TODO: Read - all, by id, by search, ...many kinds....

export function getAll() {
    return db_conn.query(`SELECT * FROM location`)
        .then(([queryResult]) => {
            // convert each result into a model object
            return queryResult.map(
                    result => newLocation(
                    result.location_id,
                    result.location_name
                )
            )
        })
}

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// getAll().then(allLocation =>{
//     console.log(allLocation)
// }) //use this code to test


// const allStaff = getAll()

// console.log(allStaff) 


//////////////////////////////////////////////////////////////////

export function getById(locationID) {
    return db_conn.query(`SELECT * FROM location WHERE location_id = ?`, [locationID])
    .then(([queryResult]) => {
        // check that at least 1 match was found
        if (queryResult.length > 0) {
            // get the first matching result
            const result = queryResult[0]

            // convert result into a model object
            return newLocation(
                    result.user_id,
                    result.location_name
            )
        } else {
            // Handle if no matches
            return Promise.reject("no matching results")
        }

    })
}

export function getByName(name) {
    return db_conn.query(`SELECT * FROM location WHERE location_name = ?`, [name])
        .then(([queryResult]) => {
            // check that at least 1 match was found
            if (queryResult.length > 0) {
                // get the first matching result
                const result = queryResult[0]

                // convert result into a model object
                return newLocation(
                    result.user_id,
                    result.location_name
                )
            } else {
                // Handle if no matches
                return Promise.reject("no matching results")
            }

        })
}

// TODO: Update

export function update(location) {
    return db_conn.query(
        `
            UPDATE location
            SET location_name = ? 
            WHERE location_id = ?
        `,
        [location.location_name, location.id]
    )
}


//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// const location1 = newLocation(7, 'Woolly')

// update (location1)

//////////////////////////////////////////////////////////////////


// TODO: Delete
export function deleteById(locationID) {
    return db_conn.query(`DELETE FROM location WHERE location_id = ?`, [locationID]);
    
}

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// deleteById(7).then(()=> console.log("Delete operation completed!"))

//////////////////////////////////////////////////////////////////
