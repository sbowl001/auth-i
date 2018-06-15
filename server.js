const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const routes = require('./User/userRoute');
const session = require('express-session');

const server = express();

mongoose.connect('mongodb://localhost/usersdb')
    .then(()=> {
        console.log('API connected to the database')
    })
    .catch( err => {
        console.log("error connecting to the database", err)
    });

server.use(express.json());
server.use(helmet());
server.use(session({secret: 'super secret pwd', name:"lambdacookie", resave: false, saveUninitialized: false}));
server.use('/api', routes);

 
// server.get('/api/restricted', checkAuthorization, (req, res) => {
//     res.status(200).json({msg: "you are authorized"})
// })

 


server.get('/', (req, res) => {
    res.send('Api is running')
})

const port = 5000;

server.listen(port, ()=> {
        console.log(`Server up and running on ${port}`)
        
})