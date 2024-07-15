import mysql from "mysql2/promise"

export const db_conn = mysql.createPool ({
    host: "localhost",
    port: 3306, //might be different for some people?
    user: "high_street_gym_user", // Should change this later before deploying to production.
    password: "high_street_gym_user",
    database: "high_street_gym"
})


export function convertToMySQLDate(date) {
    const year = date.toLocaleString('default', {year: 'numeric'});
    const month = date.toLocaleString('default', {
      month: '2-digit',
    });
    const day = date.toLocaleString('default', {day: '2-digit'});
  
    return [year, month, day].join('-');
  }