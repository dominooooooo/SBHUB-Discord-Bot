const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    supercellId: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
