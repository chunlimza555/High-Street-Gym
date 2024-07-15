import { db_conn} from "../database.js";

// This files job is to represent (model) the users table in the database.

export function newBooking(
    id,
    user_id,
    class_id,
    created_datetime,
    user_firstname, 
    user_lastname, 
    activity_name,
    class_datetime,
    location_name) 
    {
    return {
        id,
        user_id,
        class_id,
        created_datetime,
        user_firstname,
        user_lastname,
        activity_name,
        class_datetime,
        location_name      
    }
}

// TODO: Create
/*
* Insert a new user object into the database
* @param {*} user - user model object created with newUser()
* @returns - Database result
*/
export function create(newBooking) {
    return db_conn.query(
        `   
        INSERT INTO bookings (booking_user_id, booking_class_id, booking_created_datetime) 
        VALUES (?, ?, ?)
        `,
        [newBooking.user_id, newBooking.class_id, newBooking.created_datetime]
        
    );
}

// This is a function definition (this is where the function is model)
// function hello(){}

// This is a function call (or calling the function) i.e. where it is used.
// hello()

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////


// const book1 = newBooking(null,14, 4, '2024-05-20 15:00:00')

// create(book1)

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// TODO: Read - all, by id, by search, ...many kinds....

export function getAll() {
    return db_conn.query(`
    SELECT * FROM bookings 
    INNER JOIN users ON bookings.booking_user_id = users.user_id 
    INNER JOIN classes ON bookings.booking_class_id = classes.class_id
    INNER JOIN activities ON classes.class_activity_id = activities.activity_id
    INNER JOIN location ON classes.class_location_id = location.location_id
    `
    )
        .then(([queryResult]) => {
            // convert each result into a model object
            return queryResult.map(
                    result => newBooking(
                    result.booking_id,
                    result.booking_user_id,
                    result.booking_class_id,
                    result.booking_created_datetime,
                    result.user_firstname,
                    result.user_lastname,
                    result.activity_name,
                    result.class_datetime,
                    result.location_name  
                    
                )
            )
        })
}

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// getAll().then(newBooking =>{
//     console.log(newBooking)
// }) //use this code to test


// const allStaff = getAll()

// console.log(allStaff) 


//////////////////////////////////////////////////////////////////

export function getById(bookingID) {
    return db_conn.query(`SELECT * FROM bookings WHERE booking_id = ?`, [bookingID])
    .then(([queryResult]) => {
        // check that at least 1 match was found
        if (queryResult.length > 0) {
            // get the first matching result
            const result = queryResult[0]

            // convert result into a model object
            return newBooking(
                    result.booking_id,
                    result.booking_user_id,
                    result.booking_class_id,
                    result.booking_created_datetime
                    
            )
        } else {
            // Handle if no matches
            return Promise.reject("no matching results")
        }

    })
}

// test ///
// getById(1).then((booking) => {
//     console.log(booking)
// })

////test ///



export function getByUserId(user_id) {
    return db_conn.query(`SELECT * FROM bookings WHERE booking_user_id = ? `, [user_id])
        .then(([queryResult]) => {
            // check that at least 1 match was found
            if (queryResult.length > 0) {
                // get the first matching result
                const result = queryResult[0]

                // convert result into a model object
                return newBooking(
                    result.booking_id,
                    result.booking_user_id,
                    result.booking_class_id,
                    result.booking_created_datetime
                )
            } else {
                // Handle if no matches
                return Promise.reject("no matching results")
            }

        })
}

/// test ///
// getByUserId(2).then((booking) => {
//     console.log(booking)
// })

// test ///


// TODO: Update

export function update(booking) {
    return db_conn.query(
        `
        UPDATE bookings
        SET booking_user_id = ?, booking_class_id = ?, booking_created_datetime = ? 
        Where booking_id = ?
        `,
        [booking.user_id, booking.class_id, booking.created_datetime, booking.id]
    )
}


//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// const booking1 = newBooking(12, 14, 4, '2024-05-09 10:30:00')

// update (booking1)

//////////////////////////////////////////////////////////////////


// TODO: Delete
export function deleteById(bookingID) {
    return db_conn.query(`DELETE FROM bookings WHERE booking_id = ?`, [bookingID]);
    
}

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// deleteById(9).then(()=> console.log("Delete operation completed!"))

//////////////////////////////////////////////////////////////////
