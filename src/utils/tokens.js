import { User } from "../models/user.model.js"
import apiError from "./apiError.js"


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new apiError(404, "User not found")
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave : false })

        return {accessToken,refreshToken}
    } catch (error) {
        throw new apiError(500,"Server failed To Generate Access or Refresh Token !")
    }
}

export default generateAccessAndRefreshToken;