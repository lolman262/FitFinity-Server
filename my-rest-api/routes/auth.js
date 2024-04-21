const { Router } = require('express');
const passport = require('passport');

const router = Router();





router.post('/login', passport.authenticate('local'), (req, res) => {
    res.sendStatus(200);
});

router.post('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});
module.exports = router;