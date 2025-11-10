module.exports = {  
    addSnap: async (parent, args, context) => {
        const { input } = args;

        const newSnap = await new context.db.Snap({
            message: input.message,
            userId: input.userId,
        });
        return await newSnap.save();
    },
}