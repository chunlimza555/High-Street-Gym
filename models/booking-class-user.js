import { db_conn } from "../database.js";


export function newBookingClassUser(
        booking_id,
        booking_user_id,
        booking_class_id,
        booking_created_datetime,

        class_id,
        class_datetime, 
        class_location_id, 
        class_activity_id, 
        class_trainer_user_id,
        trainer_firstname,
        trainer_lastname,

        user_id,
        user_email, 
        user_password, 
        user_role, 
        user_phone, 
        user_firstname, 
        user_lastname, 
        user_address,
        activity_name,
        location_name
) 
    {
    return {
        booking_id,
        booking_user_id,
        booking_class_id,
        booking_created_datetime,

        class_id,
        class_datetime, 
        class_location_id, 
        class_activity_id, 
        class_trainer_user_id,
        trainer_firstname,
        trainer_lastname,

        user_id,
        user_email, 
        user_password, 
        user_role, 
        user_phone, 
        user_firstname, 
        user_lastname, 
        user_address,
        activity_name,
        location_name
        

    }
}




export function getAll() {
    return db_conn.query(
        `SELECT *,
        trainer.user_firstname AS trainer_firstname,
        trainer.user_lastname AS trainer_lastname
    
        
        FROM bookings
        INNER JOIN classes
        ON bookings.booking_class_id = classes.class_id

        INNER JOIN activities
        ON classes.class_activity_id = activities.activity_id

        INNER JOIN location
        ON classes.class_location_id = location.location_id

        INNER JOIN users
        ON bookings.booking_user_id = users.user_id

        INNER JOIN users AS trainer
        ON classes.class_trainer_user_id = trainer.user_id

        
        `)
        .then(([queryResult]) => {
            // convert each result into a model object
            return queryResult.map(
                    result => newBookingClassUser(
                        result.booking_id,
                        result.booking_user_id,
                        result.booking_class_id,
                        result.booking_created_datetime,
        
                        result.class_id,
                        result.class_datetime, 
                        result.class_location_id, 
                        result.class_activity_id, 
                        result.class_trainer_user_id,
                        result.trainer_firstname,
                        result.trainer_lastname,
        
                        result.user_id,
                        result.user_email, 
                        result.user_password, 
                        result.user_role, 
                        result.user_phone, 
                        result.user_firstname, 
                        result.user_lastname, 
                        result.user_address,

                        result.activity_name,
                        result.location_name
                    
                )
            )
        })
}

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// getAll().then(newBookingClassUser =>{
//     console.log(newBookingClassUser)
// }) //use this code to test


// const allStaff = getAll()

// console.log(allStaff) 


//////////////////////////////////////////////////////////////////



export function getAllByBookingID(BookingID) {
    return db_conn.query(
        `
        SELECT * ,
        trainer.user_id AS trainer_id,
        trainer.user_firstname AS trainer_firstname,
        trainer.user_lastname AS trainer_lastname,
        member.user_id AS member_id,
        member.user_firstname AS member_firstname,
        member.user_lastname AS member_lastname

        FROM bookings
        INNER JOIN classes
        ON bookings.booking_class_id = classes.class_id

        INNER JOIN users AS member
        ON bookings.booking_user_id = member.user_id

        INNER JOIN users AS trainer
        ON classes.class_trainer_user_id = trainer.user_id

        INNER JOIN activities
        ON classes.class_activity_id = activities.activity_id

        INNER JOIN location
        ON classes.class_location_id = location.location_id

        WHERE bookings.booking_id = ?
        
        
        
    `,
        [BookingID]
    ).then(([queryResult]) => {
            // check that at least 1 order was found
            if (queryResult.length > 0) {
                // get the first matching result
                const result = queryResult[0]
                // convert result into a model object
                return newBookingClassUser(  //the name of after result. shoud be the same with database
                        result.booking_id,
                        result.booking_user_id,
                        result.booking_class_id,
                        result.booking_created_datetime,
                
                        result.class_id,
                        result.class_datetime, 
                        result.class_location_id, 
                        result.class_activity_id, 
                        result.class_trainer_user_id,
                        result.trainer_firstname,
                        result.trainer_lastname,
                
                        result.member_id,
                        result.user_email, 
                        result.user_password, 
                        result.user_role, 
                        result.user_phone, 
                        result.member_firstname, 
                        result.member_lastname, 
                        result.user_address,

                        result.activity_name,
                        result.location_name
                
            )

        } else {
            return Promise.reject("no matching results")
        }

})


}
// // test //
// getAllByBookingID(6).then((booking) => {
//     console.log(booking)
// })
// // test//



export function getAllByUserID(userID) {
    return db_conn.query(
        `
        SELECT * ,
        trainer.user_id AS trainer_id,
        trainer.user_firstname AS trainer_firstname,
        trainer.user_lastname AS trainer_lastname,
        member.user_id AS member_id,
        member.user_firstname AS member_firstname,
        member.user_lastname AS member_lastname

        FROM bookings
        INNER JOIN classes
        ON bookings.booking_class_id = classes.class_id

        INNER JOIN users AS member
        ON bookings.booking_user_id = member.user_id

        INNER JOIN users AS trainer
        ON classes.class_trainer_user_id = trainer.user_id

        INNER JOIN activities
        ON classes.class_activity_id = activities.activity_id

        INNER JOIN location
        ON classes.class_location_id = location.location_id

        WHERE bookings.booking_user_id = ?
        
        
    `,
        [userID]
    ).then(([queryResult]) => {
        if (queryResult.length > 0) {
            // get the first matching result
            const result = queryResult[0]
        // convert each result into a model object
        return queryResult.map(
            result => newBookingClassUser(
                        result.booking_id,
                        result.booking_user_id,
                        result.booking_class_id,
                        result.booking_created_datetime,
                
                        result.class_id,
                        result.class_datetime, 
                        result.class_location_id, 
                        result.class_activity_id, 
                        result.class_trainer_user_id,
                        result.trainer_firstname,
                        result.trainer_lastname,
                
                        result.member_id,
                        result.user_email, 
                        result.user_password, 
                        result.user_role, 
                        result.user_phone, 
                        result.member_firstname, 
                        result.member_lastname, 
                        result.user_address,

                        result.activity_name,
                        result.location_name
            )
        )
    } else {
        return Promise.reject("no matching results")
    }
    })
}

// test //
// getAllByUserID(14).then((booking) => {
//     console.log(booking)
// })
// test//


export function getByClassId(class_id) {
    return db_conn.query(
        `
        SELECT * FROM bookings
        INNER JOIN classes
        ON bookings.booking_class_id = classes.class_id

        INNER JOIN users
        ON bookings.booking_user_id = users.user_id
        
        WHERE classes.class_id = ?  
    `,
        [class_id]
    ).then(([queryResult]) => {
        if (queryResult.length > 0) {
            // get the first matching result
            const result = queryResult[0]
        // convert each result into a model object
        return queryResult.map(
            result => newBookingClassUser(
                result.booking_id,
                result.booking_user_id,
                result.booking_class_id,
                result.booking_created_datetime,
        
                result.class_id,
                result.class_datetime, 
                result.class_location_id, 
                result.class_activity_id, 
                result.class_trainer_user_id,
                result.trainer_firstname,
                result.trainer_lastname,
        
                result.user_id,
                result.user_email, 
                result.user_password, 
                result.user_role, 
                result.user_phone, 
                result.user_firstname, 
                result.user_lastname, 
                result.user_address,

                result.activity_name,
                result.location_name
            )
        )
    } else {
        return Promise.reject("no matching results")
    }
    })
}


//test//
// getByClassId(1).then((bookings) => {
//     console.log(bookings)
// })

///


export function getBySearch(searchTerm) {
    return db_conn.query(
        `SELECT * FROM bookings
        INNER JOIN classes
        ON bookings.booking_class_id = classes.class_id

        INNER JOIN users
        ON bookings.booking_user_id = users.user_id

        WHERE (users.user_firstname LIKE ? OR users.user_lastname LIKE ?) ` ,

        [`%${searchTerm}%`, `%${searchTerm}%`],

    ).then(([queryResult]) => {
        // convert each result into a model object
        return queryResult.map(
            result => newBookingClassUser(
                result.booking_id,
                result.booking_user_id,
                result.booking_class_id,
                result.booking_created_datetime,
        
                result.class_id,
                result.class_datetime, 
                result.class_location_id, 
                result.class_activity_id, 
                result.class_trainer_user_id,
                result.trainer_firstname,
                result.trainer_lastname,
        
                result.user_id,
                result.user_email, 
                result.user_password, 
                result.user_role, 
                result.user_phone, 
                result.user_firstname, 
                result.user_lastname, 
                result.user_address,

                result.activity_name,
                result.location_name

            )
        )

    })
}

//test//
// getBySearch("Jack").then((bookings) => {
//     console.log(bookings)
// })
//test//

export function getBySearchTerm(searchTerm) {
    return db_conn.query(`
        SELECT bookings.booking_id, bookings.booking_class_id, bookings.booking_user_id, bookings.booking_created_datetime,
               activities.activity_name, classes.class_datetime, location.location_name,
               users.user_firstname, users.user_lastname, users.user_email, users.user_password, users.user_role,
               trainer.user_firstname AS trainer_firstname, trainer.user_lastname AS trainer_lastname
        FROM bookings
        INNER JOIN classes ON bookings.booking_class_id = classes.class_id
        INNER JOIN users ON bookings.booking_user_id = users.user_id
        INNER JOIN activities ON classes.class_activity_id = activities.activity_id
        INNER JOIN users AS trainer ON classes.class_trainer_user_id = trainer.user_id
        INNER JOIN location ON classes.class_location_id = location.location_id
        
          AND (users.user_firstname LIKE ? OR users.user_lastname LIKE ?)
    `, [`%${searchTerm}%`, `%${searchTerm}%`])
    .then(([queryResult]) => {
        return queryResult.map(result => ({
            booking_id: result.booking_id,
            class_id: result.booking_class_id,
            user_id: result.booking_user_id,
            booking_datetime: result.booking_created_datetime,
            activity_name: result.activity_name,
            // class_datetime:result.class_datetime,
            class_date: new Date(result.class_datetime).toLocaleDateString('en-AU', { day: 'numeric', month: "short", year: "numeric"}),
            // class_time: result.class_datetime && typeof result.class_datetime === 'string' ? result.class_datetime.substring(11, 16) : '',
            class_time: new Date(result.class_datetime).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
            location_name: result.location_name,
            trainer_firstname: result.trainer_firstname,
            trainer_lastname: result.trainer_lastname,
            user_firstname: result.user_firstname,
            user_lastname: result.user_lastname,
            user_email: result.user_email,
            user_password: result.user_password,
            user_role: result.user_role
        }));
    });
};



//test//
// getBySearchTerm("Jack").then((bookings) => {
//     console.log(bookings)
// })
//test//

export function getEverything() {
    return db_conn.query(`
        SELECT bookings.booking_id, bookings.booking_class_id, bookings.booking_user_id, bookings.booking_created_datetime,
               activities.activity_name, classes.class_datetime, location.location_name,
               users.user_firstname, users.user_lastname, users.user_email, users.user_password, users.user_role,
               trainer.user_firstname AS trainer_firstname, trainer.user_lastname AS trainer_lastname
        FROM bookings
        INNER JOIN classes ON bookings.booking_class_id = classes.class_id
        INNER JOIN users ON bookings.booking_user_id = users.user_id
        INNER JOIN activities ON classes.class_activity_id = activities.activity_id
        INNER JOIN users AS trainer ON classes.class_trainer_user_id = trainer.user_id
        INNER JOIN location ON classes.class_location_id = location.location_id
        
    `)
    .then(([queryResult]) => {
        return queryResult.map(result => {
            const classDatetime = new Date(result.class_datetime);
            return {
                booking_id: result.booking_id,
                class_id: result.booking_class_id,
                user_id: result.booking_user_id,
                booking_datetime: result.booking_created_datetime,
                activity_name: result.activity_name,
                // class_datetime:result.classDatetime,
                class_date: classDatetime.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
                class_time: classDatetime.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
                location_name: result.location_name,
                trainer_firstname: result.trainer_firstname,
                trainer_lastname: result.trainer_lastname,
                user_firstname: result.user_firstname,
                user_lastname: result.user_lastname,
                user_email: result.user_email,
                user_password: result.user_password,
                user_role: result.user_role
            };
        });
    });
};

//test//
// getEverything("Homme").then((bookings) => {
//     console.log(bookings)
// })
//test//




export function getAllByBooking(bookingID) {
    return db_conn.query(`
        SELECT bookings.*, 
            classes.class_datetime, 
            class_activity_id,
            classes.class_location_id, 
            activities.activity_name,
            location.location_name,
    
            users.user_firstname, 
            users.user_lastname, 
            class_trainer_user_id,
            trainer.user_firstname AS trainer_firstname, 
            trainer.user_lastname AS trainer_lastname


        FROM bookings
        INNER JOIN classes ON 
        bookings.booking_class_id = classes.class_id

        INNER JOIN activities ON 
        classes.class_activity_id = activities.activity_id

        INNER JOIN users ON 
        bookings.booking_user_id = users.user_id

        INNER JOIN users AS trainer ON 
        classes.class_trainer_user_id = trainer.user_id

        INNER JOIN location ON classes.class_location_id = location.location_id
        WHERE bookings.booking_id = ?

    `, [bookingID]).then(([queryResult]) => {
        if (queryResult.length > 0) {
            const result = queryResult[0];
            return {
                booking_id: result.booking_id,
                class_id: result.booking_class_id,
                user_id: result.booking_user_id,
                class_datetime: result.class_datetime,
                activity_id: result.class_activity_id,
                location_name: result.location_name,
                class_trainer_user_id: result.class_trainer_user_id,
                user_firstname: result.user_firstname,
                user_lastname: result.user_lastname,
                trainer_firstname: result.trainer_firstname,
                trainer_lastname: result.trainer_lastname,
                location_id : result.class_location_id
            };
        } else {
            return Promise.reject("No matching results");
        }
    });
};


//Test//
// getAllByBooking(5).then((newBookingClassUser) => {
//         console.log(newBookingClassUser)})

//Test//




