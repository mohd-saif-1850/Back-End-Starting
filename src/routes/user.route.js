import { Router } from "express";
import {registerUser, loginUser, logoutUser, newAccessToken} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import verifyJWT from "../middlewares/auth.controller.js"

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


export default router;