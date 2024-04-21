
const LocalStrategy = require('passport-local');
const passport = require('passport');

const db = require('../database');
//const User = require('../models/User');

// Assuming you have a User model


passport.serializeUser((user, done) => {
    done(null, user.userID);
});


passport.deserializeUser(async(id, done) => {
    try {
     //   console.log(id);
        const result = await db.promise().query('SELECT * FROM users WHERE id = ?', [id]);
        const user = {
            userID: result[0][0].id,
            username: result[0][0].username
        };
      
        done(null, user);
    } catch (error) {
        done(error, null);
    }
    
});


passport.use(
    new LocalStrategy(

        async (username, password, done) => {
            
            try {
                const result = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
                if (result[0].length === 0) {
                    
                    return done(null, false, { message: 'Invalid username or password' });
                } else {
                    const user = result[0][0];
                    if (user.password === password) {
                        console.log("authenticated, "+ user.id);
                        return done(null, { userID: user.id, username: user.username });
                    } else {
                        return done(null, false, { message: 'Invalid username or password' });
                    }
                }
            } catch (error) {
                return done(error, false, { message: 'Invalid username or password' });
            }
        }
    )
);
