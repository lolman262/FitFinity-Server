const mysql = require('mysql2');

// Create a connection pool

module.exports = mysql.createConnection({
    host: '192.168.1.97',
    user: 'imnew4',
    password: 'XSupernova256',
    database: 'WorkoutPlanner'
})



// // Execute a query
// pool.query('SELECT * FROM DELIVERY_AREA', (error, results, fields) => {
//     if (error) {
//         console.error('Error executing query:', error);
//         return;
//     }

//     // Process the query results
//     console.log('Query results:', results);
// });

// // Close the connection pool when done
// pool.end();