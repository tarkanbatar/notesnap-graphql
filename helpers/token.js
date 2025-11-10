const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = {
    generate: ( user, expiresIn = '1h') => {
        return jwt.sign({ id: user.id || user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn });
    }
}

module.exports = token;