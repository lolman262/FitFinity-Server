const express = require('express');

const db = require('../database');

const router = express.Router();



// Register route
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Insert the username and password into the 'users' table
    const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ error: 'Failed to register user' });
        } else {
            res.status(200).json({ message: 'User registered successfully' });
        }
    });
});



router.get('/search', async (req, res) => {
    const { username } = req.body;

    const result = await db.promise().query('SELECT id, username FROM users WHERE username = ?', [username]);

    if (result[0].length === 0) {
        res.status(404).json(['User not found']);
    } else {
        res.json(result[0]);
    }
});
// Current user route
router.get('/currentUser', (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
});

// Get user by ID route
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const result = await db.promise().query('SELECT id, username FROM users WHERE id = ?', [id]);

    if (result[0].length === 0) {
        res.status(404).json(['User not found']);
    } else {
        res.json(result[0]);
    }
});

module.exports = router;