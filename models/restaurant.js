 var mongoose    =   require('mongoose');

//SCHEMA SETUP
var restaurantSchema = new mongoose.Schema({
        name: String,
        image: String,
        description: String,
        rating: String,
        price: String,
        cuisine: String,
        location: String,
        author: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"User"
                },
                username: String
        },
        comments: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Comment"
                }
            ]
    },
    {
        timestamps: true
    });
    //Timestamps true will give me access to restaurant.createdAt, to say when it was added
module.exports = mongoose.model("Restaurant", restaurantSchema);