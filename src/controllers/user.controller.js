import asyncHandler from "../utils/asyncHandler.js"
import apiError from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import cloudinaryUpload from "../utils/cloudinary.js"
import apiResponse from "../utils/apiResponse.js"
import generateAccessAndRefreshToken from "../utils/tokens.js"
import jwt from 'jsonwebtoken';

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

    if (!(username || email )) {
        throw new apiError(400, "Please Give the Username or Email !")
    }
    
    if (!password) {
        throw new apiError(400, "Please Give the Password !")
    }

    const user = await User.findOne(
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

const logoutUser = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            refreshToken: undefined
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new apiResponse(
            200,
            {},
            "User Logout Successfully"
        )
    )
})

const newAccessToken = asyncHandler( async (req,res) => {
    const userRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!userRefreshToken) {
        throw new apiError(401, "Unauthorized Request !")
    }

    try {
        const decodedToken = jwt.verify(userRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new apiError(401, "Invalid Refresh Token !")
        }
    
        if ( userRefreshToken !== user?.refreshToken) {
            throw new apiError(401,"Refresh Token Either Used or Expired !")
        }
    
        const options = {
            httpOnly : true,
            secure : true
        }
    
        const {accessToken,refreshTokenNew} = await generateAccessAndRefreshToken(user._id)
    
        return res.status(200)
        .clearCookie("accessToken",accessToken,  options)
        .clearCookie("refreshToken",refreshTokenNew, options)
        .json(
            new apiResponse(
                200,
                {accessToken,refreshTokenNew},
                "New Access Token Created Successfully !"
            )
        )
    } catch (error) {
        throw new apiError(401,"Can't Generate Access Token - Invalid Refresh Token !")
        
    }
})

const changePassword = asyncHandler( async (req,res) => {
    const {oldPassword, newPassword, conPassword} = req.body
    if (newPassword !== conPassword) {
    throw new apiError(400, "Confirm Password does not match New Password!");
  }

    const user = await User.findById(req.user._id)

    const passwordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!passwordCorrect) {
        throw new apiError(401, "Invalid Password !")
    }

    user.password = newPassword
    await user.save({validateBeforeSave : false})

    return res.status(200).json(new apiResponse(200,{}, "Password Changed Successfully !"))
})

const currentUser = asyncHandler (async (req,res) => {
    return res.status(200).json(new apiResponse(200, req.user, "Current User Fetched Successfully !"))
})

const changeFullName = asyncHandler(async (req,res) => {
    const {fullName} = req.body
    if (!fullName) {
        throw new apiError(401,"Please Give Full Name !")
    }

    const changedUser = User.findByIdAndUpdate(req.user._id,{
        $set: {fullName}
    },{new: true}).select("-password")
    if (!changedUser) {
        throw new apiError(404,"User Not Found !")
    }

    return req.status(200).json(new apiResponse(200, changedUser, "User Details Changed Successfully !"))
})

export {registerUser,loginUser,logoutUser,newAccessToken,changePassword,currentUser,changeFullName}