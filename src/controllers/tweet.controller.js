import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js";
import {Tweet} from "../models/tweets.model.js"



const createTweet = asyncHandler( async(req,res) => {
    const {content} = req.body

    if (!content) {
        throw new apiError(402,"Content is Required !")
    }

    const tweetCreation = await Tweet.create({
        content,
        owner: req.user._id
    })

    if (!tweetCreation) {
        throw new apiError(500,"Server Failed to Create !")
    }

    return res.status(200).json(new apiResponse(200,tweetCreation,"Tweet Created Successfully !"))
})

export {createTweet}