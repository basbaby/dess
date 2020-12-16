const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    organization: String,
    telephone: String,
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ]
})

module.exports = mongoose.model('User', userSchema)