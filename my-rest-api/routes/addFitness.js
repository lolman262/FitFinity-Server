const express = require('express');
const fitnessAssistant = require('../openai/fitness_assistant');
const passport = require('passport');

const router = express.Router();
const db = require('../database');

router.use(passport.session());

function isAuthenticated(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status(401).json({ message: 'Unauthorized' }); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            next();
        });
    })(req, res, next);
}

router.post('/addPlan', isAuthenticated, async (req, res) => {
    try {
        const { age, height, gender, goal, experience, gym_equipment } = req.body;
        console.log(req.user);

        // Validate inputs
        if (!age || !height || !gender || !goal || !experience || !gym_equipment) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        
        const result = await fitnessAssistant.runAssistant(age, `${height} cm`, gender, goal, experience, gym_equipment);
        console.log("result: " + result);
        const resultJson = JSON.parse(result);

        if(result == '{ }' || result == '{}'){
            res.status(500).json({ error: 'Error generating workout plan' });
            throw new Error('Error generating workout plan');
        }

        const query = `INSERT INTO workout VALUES ( NULL, '${req.user.username}', NOW(), 
        '${resultJson.day_1_title}', '${resultJson.day_1_content}', 
        '${resultJson.day_2_title}', '${resultJson.day_2_content}', 
        '${resultJson.day_3_title}', '${resultJson.day_3_content}', 
        '${resultJson.day_4_title}', '${resultJson.day_4_content}', 
        '${resultJson.day_5_title}', '${resultJson.day_5_content}',
        '${resultJson.day_6_title}', '${resultJson.day_6_content}',
        '${resultJson.day_7_title}', '${resultJson.day_7_content}');`;







        console.log(query);
        db.query(query, (error, results) => {
            if (error) {
                console.error('Error adding workout to database:', error);
              
                res.status(500).json({ error: 'Failed to add workout to database' });
            } else {
                res.json(JSON.parse(result));
               
            }
        });
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;