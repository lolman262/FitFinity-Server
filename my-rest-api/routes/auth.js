const { Router } = require('express');
const passport = require('passport');

const router = Router();

// Define your authentication routes here
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.sendStatus(200);
    // Handle successful login
   // res.json({ message: 'Login successful' });
});

// router.post('/register', (req, res) => {
//     // Handle user registration
// });

// Export the router


module.exports = router;