const Snap = {
    snap : async (parent, args, context) => {
        return context.db.Snap.findById(args.id);
    }
}