const User = {
    snaps: async (parent, args, context, info) => {
        return await context.db.Snap.find({ userId: parent.id });
    },
}

module.exports = User;