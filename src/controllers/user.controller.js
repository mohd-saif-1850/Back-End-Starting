import asyncHandler from "../utils/asyncHandler.js"
import apiError from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import cloudinaryUpload from "../utils/cloudinary.js"
import apiResponse from "../utils/apiResponse.js"
import generateAccessAndRefreshToken from "../utils/tokens.js"

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

const loginUser = asyncHandler( async (req,res) => {
    const { username, email, password } = req.body

    if (!username || !email ) {
        throw new apiError(400, "Please Give the Username or Email !")
    }
    
    if (!password) {
        throw new apiError(400, "Please Give the Password !")
    }

    const user = User.findOne(
        {
            $or : [ { username }, { email } ]
        }
    )

    if (!user) {
        throw new apiError(404, "User Not Found !")
    }

    const isPasswordValid = user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new apiError(402,"Password is Incorrect !")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            `${username || email} Logged In !`
        )
    )
})



export {registerUser,loginUser}