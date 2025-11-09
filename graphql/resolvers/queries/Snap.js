const Snap = {
    user : async (parent, args, context) => {
        return await context.db.User.findById(parent.userId);
    }
}

module.exports = Snap;