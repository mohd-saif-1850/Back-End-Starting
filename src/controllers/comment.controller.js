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

const updateComment = asyncHandler( async(req,res) => {
    const {content,commentId} = req.body

    if (!content) {
        throw new apiError(402,"Content is Required !")
    }

    if (!commentId) {
        throw new apiError(402,"Comment ID is Required !")
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId,{
        $set : {content}
    },{new: true})

    if (!updateComment) {
        throw new apiError(500,"Server Failed to Update a Comment !")
    }

    return res.status(200).json(new apiResponse(200,updateComment,"Comment Updated Successfully !"))
})

const deleteComment = asyncHandler( async(req,res) => {
    const {commentId} = req.body

    if (!commentId) {
        throw new apiError(402,"Comment ID is Required !")
    }

    const deleteCmt = await Comment.findByIdAndDelete(commentId)

    if (!deleteCmt) {
        throw new apiError(500,"Server Failed to Delete a Comment !")
    }

    return res.status(200).json(new apiResponse(200,deleteCmt,"Comment Deleted Successfully !"))
})

const userComments = asyncHandler( async(req,res) => {
    
    const comments = await Comment.find({owner: req.user._id})

    if (!comments) {
        throw new apiError(500,"Server Failed to Fetch Comments !")
    }

    return res.status(200).json(new apiResponse(200,comments,"Comments Fetched Successfully !"))
})

export {createComment,updateComment,deleteComment,userComments}