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
        return await newUser.save();
    },
}