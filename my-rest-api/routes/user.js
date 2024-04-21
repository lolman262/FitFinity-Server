const express = require('express');

const db = require('../database');

const router = express.Router();

const multer = require('multer');

router.use(express.urlencoded({ extended: false }));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname); // Append extension
    }
});

const upload = multer({ storage: storage });
// export const useUploadProfileImage = () => {
//     return useMutation(
//         (data) => 
//             api
//                 .post(Endpoints.Media.Upload, data, {
//                     headers: { "Content-Type": "multipart/form-data" },
//                     })
//                 .then((res) => {
//                     console.log(res?.data?.result)
//                     console.log(res?.data?.result.path)
//                     return res?.data?.result.path
//                     })
//     )
// }

// Register route
router.post('/register', upload.single('profilePicture'), async (req, res) => {
    const { username, password, email, age, weight, gender } = req.body;
    //console.log(req.body);
    //const username = req.body.username;
    console.log("username : " + username);

    const profilePicture = req.file.path;
    // console.log("pfp : " + profilePicture);




    const checkQuery = `SELECT * FROM users WHERE username = '${username}'`;
    db.query(checkQuery, (error, results) => {
        if (error) {
            console.error('Error checking username:', error);
            res.status(500).send('Failed to check username');
        } else {
            if (results.length > 0) {
                console.log("Username already taken")
                res.status(409).send('Username already taken');
            } else {
                console.log("Username is available");


                //console.log(profilePicture);
                const pfpPicWithSlash = profilePicture.replace(/\\/g, '\\\\');
                const query = `INSERT INTO users VALUES (NULL, '${username}', '${password}','${email}', '${pfpPicWithSlash}','${age}','${weight}','${gender}');`;
                console.log(query);
                db.query(query, (error, results) => {
                    if (error) {
                        console.error('Error registering user:', error);
                        res.status(500).json({ error: 'Failed to register user' });
                    } else {
                        res.status(200).json({ message: 'User registered successfully' });
                    }
                });
                
            }

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