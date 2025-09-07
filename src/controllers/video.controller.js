import mongoose from "mongoose";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinaryUpload from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import apiResponse from "../utils/apiResponse.js";


const uploadVideo = asyncHandler( async (req,res) => {
    const {title, description} = req.body

    if (!title) {
        throw new apiError(401, "Title is Required !")
    }

    if (!description) {
        throw new apiError(401,"Description is Required !")
    }

    const thumbnailLocalPath = req.files?.thumbnail?.[0].path

    if (!thumbnailLocalPath) {
        throw new apiError(401,"Thumnail is Required !")
    }

    const thumbnailUpload = await cloudinaryUpload(thumbnailLocalPath)

    if (!thumbnailUpload) {
        throw new apiError(500,"Thumbnail Failed to Upload !")
    }

    console.log("Thumbnail upload details:", thumbnailUpload);

    const videoLocalPath = req.files?.videoFile?.[0].path

    if (!videoLocalPath) {
        throw new apiError(401, "Video File is Required !")
    }

    const videoUpload = await cloudinaryUpload(videoLocalPath)

    if (!videoUpload) {
        throw new apiError(500, "Video Upload is Failed !")
    }

    console.log("Video upload details:", videoUpload);

    const newVideo = await Video.create({
        title,
        description,
        thumbnail : thumbnailUpload.url,
        videoFile : videoUpload.url,
        duration : videoUpload.duration
    })

    return res.status(200).json(new apiResponse(200,newVideo,"Video Upload Successfully !"))

})

const updateVideoDetails = asyncHandler( async (req, res) => {
    const {title, description} = req.body

    if (!title) {
        throw new apiError(402,"Title is required !")
    }

    if (!description) {
        throw new apiError(402,"Description is required !")
    }

    const updateDetails = await Video.findByIdAndUpdate(req.video._id,{
        $set : {
            title,
            description
        }
    },{new: true})

    if (!updateDetails) {
        throw new apiError(401,"No Video Found !")
    }

    return res.status(200)
    .json(new apiResponse(200,updateDetails,"Title and Description Updated Successfully !"))
})

export {uploadVideo,updateVideoDetails}