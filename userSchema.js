const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true
    },
    pins: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('User', userSchema);
