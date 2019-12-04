const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');

const UserLib = require('./library/user-lib.js');

// TODO: Use config file or env vars for database name and port
const MONGODB_URI = 'mongodb://localhost:27017/basicgram-database';
const port = 3003;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
    console.log("Connected to MongoDB");
});
mongoose.connection.on('error', (error) => {
    console.log("ERROR: " + error);
});

const app = express();
app.use(cookieParser());
app.use(bodyParser());
// TODO: Validate requests either here using express-validator or with custom validator library


/**
 * GET user information based on userId
 *
 * @param userId of the user to get
 */
app.get('/user/:userId', (req, res) => {
    // TODO: RETURN USER INFO
    let userId = req.params.userId;
    UserLib.getUserInfo(userId, res);
});

app.put('/user/:userId', (req, res) => {
    // TODO: Edit user information based on request body
    let userId = req.params.userId;
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));