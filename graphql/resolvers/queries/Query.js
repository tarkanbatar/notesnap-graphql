const Query = {
    user: (parent, args, context, info) => { return context.db.User.findById(args.id);},
}

module.exports = Query;