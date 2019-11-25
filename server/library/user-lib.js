const mongoose = require('mongoose');

const User = require('../models/user-model.js');
const ObjectId = mongoose.Types.ObjectId;


class UserLibrary {
    static createUser(username, password, name, email) {
        // TODO: Validate input
        let token = new ObjectId();

        const newUser = new User({
            username: username,
            password: password,
            name: name,
            created_at: new Date(),
            token: token
        });

        newUser.save((err) => {
            if (err) throw err;
        });

        return newUser
    };

    // TODO: Pass in res
    static editUsername(userId, username) {
        const updatedUser = {
            username: username
        };

        User.findByIdAndUpdate(userId, updatedUser, err => {
            if (err) throw err;
            else {
                return {success: 'success'}
            }
        })
    };

    // TODO: Pass in res
    static checkUser(username) {
        User.findOne(username, (err,item)=>{
            if (err) return false;
            else if (item) return true;
            else return false;
        })
    }

    static loginUser(username, password, res) {
        this._getUserByUsername(username).then((user) => {
            if (user.password === password) {
                res.send({
                    userId: user._id,
                    token: user.token,
                    valid: true,
                });
            } else {
                res.send({
                    valid: false
                });
            }
        }).catch(() => res.send({valid:false}))
    }

    // TODO: Pass in res
    static editPassword(userId, password) {
        const updatedUser = {
            password: password
        };

        User.findByIdAndUpdate(userId, updatedUser, err => {
            if (err) throw err;
            else {
                return {success: 'success'}
            }
        })
    };

    static _getUserByUsername(username) {
        return User.findOne({ username: username });
    }

    static _getUserById(userId) {
        return User.findById(userId);
    }

    static verifyUserToken(userId, token, res) {
        this._getUserById(userId).then((user) => {
            let valid = false;
            if (user.token === token) valid = true;

            if (res) {
                res.send({
                    valid,
                })
            } else {
                console.log('User verified: ' + valid);
            }
        });
    }

    // TODO: Further execute all user business logic
}

module.exports = UserLibrary;