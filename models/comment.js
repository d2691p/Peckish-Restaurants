var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    rating: String,
    price: String,
    author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
    },
},
    {
        timestamps: true
    });
    //Timestamps true will give me access to comment.createdAt, to say when it was added;

module.exports = mongoose.model("Comment", commentSchema);