import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema({
    comment: {
        type: Schema.Types.ObjectId,
        rer: "Comment"
    },
    video: {
        type: Schema.Types.ObjectId,
        rer: "Video"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        rer: "User"
    },
    tweets: {
        type: Schema.Types.ObjectId,
        rer: "Tweet"
    }
},{timestamps: true})

export const Like = mongoose.model("Like",likeSchema)