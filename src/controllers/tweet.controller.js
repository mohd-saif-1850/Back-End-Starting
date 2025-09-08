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

const updateTweet = asyncHandler( async(req,res) => {
    const {tweetId, newContent} = req.body

    if (!tweetId) {
        throw new apiError(402,"Tweet ID is Required !")
    }

    if (!newContent) {
        throw new apiError(402,"Content is Required !")
    }

    const newTweet = await Tweet.findByIdAndUpdate(tweetId,{
        $set : {content : newContent}
    },{new : true})

    if (!newTweet) {
        throw new apiError(500,"Server Failed to Update Tweet !")
    }

    return res.status(200).json(new apiResponse(200,newTweet,"Tweet Updated Successfully !"))
})

const deleteTweet = asyncHandler( async(req,res) => {
    const {tweetId} = req.body

    if (!tweetId) {
        throw new apiError(402,"Tweet ID is Required !")
    }

    const tweetDelete = await Tweet.findByIdAndDelete(tweetId)

    if (!tweetDelete) {
        throw new apiError(500,"Server Failed to Delete a Tweet !")
    }

    return res.status(200).json(new apiResponse(200,tweetDelete,"Tweet Deleted Successfully !"))
})

const getUserTweets = asyncHandler( async(req,res) => {

    const getTweets = await Tweet.find({owner : req.user._id})

    if (getTweets.length === 0) {
        throw new apiError(400,"No Tweets Found !")
    }

    return res.status(200).json(new apiResponse(200,getTweets,"Tweets Fetched Successfully !"))
})

export {createTweet,updateTweet,deleteTweet,getUserTweets}