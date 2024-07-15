import { db_conn} from "../database.js";

// This files job is to represent (model) the users table in the database.



export function newActivity(id, name, description, duration){
  return {
    id,
    name,
    description,
    duration
  }
}

// TODO: Create
export function create(activity) {

  // This is for mysql and the reason why we use ? is to reject SQL injection.
  return db_conn.query(`
    INSERT INTO activities (activity_name, activity_description, activity_duration) 
    VALUES (?, ?, ?)
  `, [activity.name, activity.description, activity.duration])
}
  //////////////////////// Testing area (remove before use)//////
  
  
  // const activity1 = newActivity(null, "Boxing", "Exercise", "45")
  
  // create(activity1)



export function getAll() {
    return db_conn.query("SELECT * FROM activities")
        .then(([queryResult]) => {
            return queryResult.map(
                result => newActivity(
                    result.activity_id,
                    result.activity_name,
                    result.activity_description,
                    result.activity_duration
                )
            )
        })
}

/// Test /////

// getAll().then (activity => console.log(activity))

//////////////////


export function getById(id) {
    return db_conn.query(`SELECT * FROM activities WHERE activity_id = ?`, [id])
      .then(([queryResult]) => {
        // Check that at least one match was found
        if (queryResult.length > 0){
        // Get the first matching result
          const result = queryResult[0]
  
        // Convert result to Javascript object
          return newActivity(
            result.activity_id,
            result.activity_name, 
            result.activity_description,
            result.activity_duration
          )
        } else {
          // TODO: Handle of no matches!
          return Promise.reject("NO matching results")
        }
      })
  }
  
  export function getByActivityName(activity_name) {
    return db_conn.query(`SELECT * FROM activities WHERE activity_name = ?`, [activity_name])
      .then(([queryResult]) => {
        // Check that at least one match was found
        if (queryResult.length > 0){
        // Get the first matching result
          const result = queryResult[0]
  
        // Convert result to Javascript object
          return newActivity(
            result.activity_id,
            result.activity_name, 
            result.activity_description,
            result.activity_duration
          )
        } else {
          // TODO: Handle of no matches!
          return Promise.reject("NO matching results")
        }
      })
  }

  ///////////////////// Teasting area (remove before use)//////

// getByActivityName("Yoga").then(allActivity => {
//   console.log(allActivity)
// })


/////////////////////////////////////////////////////////////


// TODO: Update
export function update(activity) {
  return db_conn.query(`
  UPDATE activities
  SET activity_name = ?, activity_description = ?, activity_duration = ? 
  WHERE activity_id = ?`, [activity.name, activity.description, activity.duration, activity.id])
}
  
  //////////////////////// Teasting area (remove before use)//////
  
  // const activity1 = newActivity(8, "Zumba", "Dance", "60")
  
  // update(activity1);
  
  ///////////////////////////////////////////////////////////////


// TODO: Delete
export function deleteById(id) {
    return db_conn.query(`DELETE FROM activities WHERE activity_id = ?`, [id])
  }
  
  //////////////////////// Testing area (remove before use)//////
  
  // deleteById(8).then(() => console.log("Delete operation completed!"))
  
  ///////////////////////////////////////////////////////////////