import { Router } from "express";
import {registerUser, loginUser, logoutUser, newAccessToken, changePassword, currentUser, changeFullName, changeAvatar, changeCoverImage, userChannel, userWatchHistory} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import verifyJWT from "../middlewares/auth.controller.js"
import { deleteVideo, updateVideoDetails, uploadVideo } from "../controllers/video.controller.js";

const router = Router()

    router.route("/register").post(
    upload.fields(
        [{
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }]
    ),registerUser)

    router.route("/login").post(loginUser)

    // Secured Routes ( A/c To HC )
    router.route("/logout").post(verifyJWT, logoutUser)
    router.route("/refresh-token").post(newAccessToken)
    router.route("/change-password").post(verifyJWT,changePassword)
    router.route("/current-user").get(verifyJWT,currentUser)

    router.route("/change-fullName").patch(verifyJWT, changeFullName)
    // Avatar and Cover Image ( Always Available in Cloudinary Even after Updating/Changing )
    router.route("/change-avatar").patch(verifyJWT, upload.single("avatar"), changeAvatar)
    router.route("/change-cover-image").patch(verifyJWT, upload.single("coverImage"), changeCoverImage)

    router.route("/c/:username").get(verifyJWT,userChannel)
    router.route("/watch-history").get(verifyJWT,userWatchHistory)

    // Video Routes
    router.route("/video-upload").post(verifyJWT, upload.fields(
        [{
            name : "thumbnail",
            maxCount : 1
        },
        {
            name : "videoFile",
            maxCount : 1
        }]
    ) ,uploadVideo)
    router.route("/update-video-details").patch(verifyJWT,updateVideoDetails)
    
    router.route("/video-delete").post(verifyJWT,deleteVideo)
    
export default router;