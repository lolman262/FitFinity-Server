
const LocalStrategy = require('passport-local');
const passport = require('passport');
//const User = require('../models/User');

// Assuming you have a User model


passport.serializeUser((user, done) => {
    done(null, user.username);
});


passport.deserializeUser(async(username, done) => {
    try{
        if(username === 'admin'){
            done(null, { username: 'admin' });
        }

    }catch(error){
        done(error, false);
    }
    
});


passport.use(
    new LocalStrategy(
        // {
        //     usernameField: 'email', // Assuming you're using email as the username field
        // },
        async (username, password, done) => {
            try {


                // try {
                //     // Find the user by email
                //     const user = await User.findOne({ email });

                //     // If user not found or password doesn't match, return error
                //     if (!user || !user.verifyPassword(password)) {
                //         return done(null, false, { message: 'Invalid email or password' });
                //     }

                //     // If user is found and password matches, return the user
                //     return done(null, user);
                // } catch (error) {
                //     return done(error);
                // }


                console.log('statement reached');
                if (username === 'admin' && password === 'admin') {
                    console.log('statement reached');
                    return done(null, { username: 'admin' });
                } else {
                    return done(null, false, { message: 'Invalid username or password' });
                }
            } catch (error) {
                done(error, false, { message: 'Invalid username or password' });
            }
        }
    )
);