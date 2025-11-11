const bcrypt = require('bcrypt');
const token = require('../../../helpers/token');

module.exports = {  
    addUser: async (parent, args, context) => {
        const { input } = args;

        const existingUser = await context.db.User.findOne({ username: input.username });
        if (existingUser) {
            throw new Error("Username already exists");
        }

        const newUser = new context.db.User({
            username: input.username,
            password: input.password,
        });
        
        await newUser.save();

        context.pubsub.publish("USER_ADDED", { user: newUser });

        const jwt = token.generate({ id: newUser._id, username: newUser.username });
        return { token: jwt };
    },


    signIn: async (parent, args, context) => {
        const { input } = args;
        const user = await context.db.User.findOne({ username: input.username });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt.compare(input.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Incorrect password");
        }

        const jwt = token.generate({ id: user._id, username: user.username });
        return { token: jwt };
    },
}