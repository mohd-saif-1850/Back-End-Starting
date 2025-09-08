import asyncHandler from "../utils/asyncHandler.js";
import {Comment} from "../models/comments.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"

const createComment = asyncHandler( async(req,res) => {
    const {content,videoId} = req.body

    if (!content) {
        throw new apiError(402,"Content is Required !")
    }

    if (!videoId) {
        throw new apiError(402,"Video ID is Required !")
    }

    const comment = await Comment.create({
        content,
        video : videoId,
        owner : req.user._id
    })

    if (!comment) {
        throw new apiError(500,"Server Failed to Create Comment !")
    }

    return res.status(200).json(new apiResponse(200,comment,"Comment Created Successfully !"))
})

export {createComment}