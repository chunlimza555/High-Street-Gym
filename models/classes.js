import { db_conn } from "../database.js";

// This files job is to represent (model) the users table in the database.

export function newClass(
    id,
    datetime, 
    location_id, 
    activity_id, 
    trainer_user_id, 
    location_name, 
    activity_name, 
    user_lastname, 
    user_firstname,
    availability = 0
) 
    {
    return {
        id,
        datetime,
        location_id,
        activity_id,
        trainer_user_id,
        location_name,
        activity_name,
        user_lastname,
        user_firstname,
        availability
    };
}

// TODO: Create
/*
* Insert a new user object into the database
* @param {*} user - user model object created with newUser()
* @returns - Database result
*/
export function create(newClass) {
    return db_conn.query(
        `
            INSERT INTO classes (class_datetime, class_location_id, class_activity_id, class_trainer_user_id) 
            VALUES (?,?,?,?)
        `,
        [newClass.datetime, newClass.location_id, newClass.activity_id, newClass.trainer_user_id]
        
    );
}

// This is a function definition (this is where the function is model)
// function hello(){}

// This is a function call (or calling the function) i.e. where it is used.
// hello()

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////
// const class1 = newClass(null, '2024-06-05 10:30:00', 4, 6, 13)

// create(class1)

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// TODO: Read - all, by id, by search, ...many kinds....

export function getAll() {
    return db_conn.query(
        `SELECT * FROM classes 
        JOIN location ON classes.class_location_id = location.location_id
        JOIN activities ON classes.class_activity_id = activities.activity_id
        JOIN users ON classes.class_trainer_user_id = users.user_id;
        `
    )
        .then(([queryResult]) => {
            // convert each result into a model object
            return queryResult.map(
                    result => newClass(
                    result.class_id,
                    result.class_datetime,
                    result.class_location_id,
                    result.class_activity_id,
                    result.class_trainer_user_id,
                    result.name,
                    result.activity_name,
                    result.user_lastname,
                    result.user_firstname
                    
                )
            )
        })
}

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// getAll().then(newClass =>{
//     console.log(newClass)
// }) //use this code to test


// const allStaff = getAll()

// console.log(allStaff) 


//////////////////////////////////////////////////////////////////

export function getById(classID) {
    return db_conn.query(`SELECT * FROM classes WHERE class_id = ?`, [classID])
    .then(([queryResult]) => {
        // check that at least 1 match was found
        if (queryResult.length > 0) {
            // get the first matching result
            const result = queryResult[0]

            // convert result into a model object
            return newClass(
                    result.class_id,
                    result.class_datetime,
                    result.class_location_id,
                    result.class_activity_id,
                    result.class_trainer_user_id,
                    
                    
                    
            )
        } else {
            // Handle if no matches
            return Promise.reject("no matching results")
        }

    })
}

//// test ///
// getById(1).then(newClass =>{
//     console.log(newClass)
// })

////test ///






export function getByLocationId(location_id) {
    return db_conn.query(`SELECT * FROM classes WHERE class_location_id = ? `, [location_id])
        .then(([queryResult]) => {
            // check that at least 1 match was found
            if (queryResult.length > 0) {
                // get the first matching result
                const result = queryResult[0]

                // convert result into a model object
                return newClass(
                    result.class_id,
                    result.class_datetime,
                    result.class_location_id,
                    result.class_activity_id,
                    result.class_trainer_user_id
                )
            } else {
                // Handle if no matches
                return Promise.reject("no matching results")
            }

        })
}

/// test ///
// getByLocationId(1).then((newClass) => {
//     console.log(newClass)
// })

// test ///





export function getByClassTrainer(searchTerm) {
    return db_conn.query(
      "SELECT * FROM classes WHERE ( class_trainer_user_id LIKE ? )",
      [`%${searchTerm}%`, `%${searchTerm}%`]
    ).then(([queryResult]) => {
      return queryResult.map(
        result => newClass(
            result.class_id,
            result.class_datetime,
            result.class_location_id,
            result.class_activity_id,
            result.class_trainer_user_id,
            result.location_name
      )
      )
    })
  }
  
  export function getBySearch(searchTerm) {
    return db_conn.query(
      `SELECT * FROM classes 
      WHERE ( class_datetime LIKE ? OR class_trainer_user_id LIKE ? )`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    ).then(([queryResult]) => {
        console.log(queryResult)
      return queryResult.map(
        result => newClass(
            result.user_id,
            result.user_firstname,
            result.user_lastname,
            result.user_username,
            result.user_password,
            result.user_role,
            result.user_email,
            result.user_phone,
            result.user_address
        )
      )
    })
  }
  
  
  ////////////////////// Teasting area (remove before use)//////
  
//   getBySearch("3").then(allClass => {
//     console.log(allClass)
//   })
  
  
  /////////////////////////////////////////////////////////////


// TODO: Update

export function update(newClass) {
    return db_conn.query(
        `
            UPDATE classes
            SET class_datetime = ?, class_location_id = ?, class_activity_id = ?, class_trainer_user_id = ?
            WHERE class_id = ?
        `,
        [newClass.datetime, newClass.location_id, newClass.activity_id, newClass.trainer_user_id, newClass.id]
    )
}


//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// const class1 = newClass(3, '2024-05-09 10:30:00', 2, 2, 3)

// update (class1)

//////////////////////////////////////////////////////////////////


// TODO: Delete
export function deleteById(classID) {
    return db_conn.query(`DELETE FROM classes WHERE class_id = ?`, [classID]);
    
}

//////////////////////////////////// Testing  Area (Remove before use!)//////////////////////////////////////////////////

// deleteById(4).then(()=> console.log("Delete operation completed!"))

//////////////////////////////////////////////////////////////////


export function updateClassAvailabilityById(classID, difference) {
    return db_conn.query(`
    UPDATE classes
    SET availability =  availability + ?
    WHERE class_id = ?
    `, [difference, classID])
};
