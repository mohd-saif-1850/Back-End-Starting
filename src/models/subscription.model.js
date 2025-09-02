import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.model,
        ref: "User"
    },
    channel: {
        type: Schema.Types.model,
        ref: "User"
    }
},{
    timestamps: true
})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)