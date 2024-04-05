const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');


const local = require('./strategies/local');
const db = require('./database');

const app = express();

const authRouter = require('./routes/auth');
const users = require('./routes/user');





// Configure express-session middleware
app.use(session({
    secret: 'your-secret-key', // Replace 'your-secret-key' with a secret key for session encryption
    resave: false,
    cookie: {
        maxAge: 60 * 60 * 1000 // 1 hour
    },
    saveUninitialized: false
}));


app.use(bodyParser.json());


app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', authRouter);
app.use('/user', users);
//REST BELOW
let todos = [];

//verify is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}



// GET request to retrieve all todos
//app.get('/api/todos', isAuthenticated, (req, res) => {

app.get('/api/todos', (req, res) => {
    res.json(todos);
});


app.get('/api/data', isAuthenticated, async (req, res) => {
    const result = await db.promise().query('SELECT * FROM users');


     console.log('Query results:', result);
    res.json(result[0]);
});


// GET request to get a specific todo by ID
app.get('/api/todos/:id', (req, res) => {
    const todoId = req.params.id;

    // Find the todo in the array by its id
    const todo = todos.find(todo => todo.id === todoId);

    // If todo with the given id is found, return it
    if (todo) {
        res.status(200).json(todo);
    } else {
        // If todo with the given id is not found
        res.status(404).json({ message: "Todo not found" });
    }
});

app.post('/api/todos', (req, res) => {

    if (req.user) {
        const newTodo = req.body;
        todos.push(newTodo);
        res.status(200).json(newTodo);
        console.log(req.body);
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.put('/api/todos/:id', (req, res) => {
    const todoId = req.params.id;
    const updatedTodo = req.body;

    // Find the todo in the array by its id and update it
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === todoId) {
            todos[i] = { ...todos[i], ...updatedTodo };
            return res.status(200).json(todos[i]);
        }
    }

    // If todo with the given id is not found
    res.status(404).json({ message: "Todo not found" });
});
//test


// DELETE request to delete a todo
app.delete('/api/todos/:id', (req, res) => {
    const todoId = req.params.id;

    // Find the index of the todo with the given id
    const index = todos.findIndex(todo => todo.id === todoId);


    if (index !== -1) {
        const deletedTodo = todos.splice(index, 1)[0];
        return res.status(200).json(deletedTodo);
    }

    // If todo with the given id is not found
    res.status(404).json({ message: "Todo not found" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})


//session login 
app.post('/api/login', (req, res) => {
    console.log(req.sessionID);
    const { username, password } = req.body;
    // console.log('test ' + username);

    if (username && password) {
        if (req.session.authenticated) {
            console.log('already authenticated');
            res.json(req.session);
        } else {
            if (username === 'admin' && password === 'admin') {

                req.session.authenticated = true;
                console.log('admin admin correct');
                req.session.authUser = { username, password };
                res.json(req.session);
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        }
    } else {
        res.status(401).json({ message: 'Bad credentials' });
    }


});



