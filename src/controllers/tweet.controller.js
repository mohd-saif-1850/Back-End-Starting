import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js";
import {Tweet} from "../models/tweets.model.js"



const createTweet = asyncHandler( async(req,res) => {
    const {tweet} = req.body

    if (!tweet) {
        throw new apiError(402,"Tweet is Required !")
    }

    const tweetCreation = await Tweet.create({
        tweet,
        owner: req.user._id
    })

    if (!tweetCreation) {
        throw new apiError(500,"Server Failed to Create !")
    }

    return res.status(200).json(new apiResponse(200,tweetCreation,"Tweet Create Successfully !"))
})

export {createTweet}