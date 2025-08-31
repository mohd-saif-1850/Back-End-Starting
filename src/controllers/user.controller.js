import asyncHandler from "../utils/asyncHandler.js"
import apiError from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import cloudinaryUpload from "../utils/cloudinary.js"
import apiResponse from "../utils/apiResponse.js"

const registerUser = asyncHandler( async (req,res) => {
    const {username, email,fullName,password} = req.body
    
    if([fullName, username, email, password].some( (fields) => fields?.trim() === "" )){
        throw new apiError(400, "All Fields Are Required !")
    }

    const existedUser = await User.findOne({
        $or : [{ username },{ email }]
    })

    if (existedUser) {
        throw new apiError(409, "Email or Username Already Exist !")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    if (!avatarLocalPath) {
        throw new apiError(400, "Local Avatar is Required !")
    }

    const avatarUpload = await cloudinaryUpload(avatarLocalPath)
    const coverImageUpload = coverImageLocalPath ?
     await cloudinaryUpload(coverImageLocalPath) : 
     null

    if (!avatarUpload) {
        throw new apiError(400, "Avatar upload failed on Cloudinary")
    }

    const createUser = await User.create({
        username : username.toLowerCase(),
        fullName,
        password,
        email,
        avatar : avatarUpload.url,
        coverImage : coverImageUpload?.url || ""
    })

    const findUser = await User.findById(createUser._id).select("-password -refreshToken")

    if (!findUser) {
        throw new apiError(500, "Server Error Please Try Again Later !")
    }

    res.status(201).json(
        new apiResponse(201,createUser,`${username} Created Successfully !`)
    )
    
})

export default registerUser;