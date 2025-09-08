import { Router } from "express";
import verifyJWT from "../middlewares/auth.controller.js"
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";

const router = Router()

    router.route("/create-tweet").post(verifyJWT,createTweet)
    router.route("/update-tweet").patch(verifyJWT,updateTweet)
    router.route("/delete-tweet").delete(verifyJWT,deleteTweet)
    router.route("/get-tweets").get(verifyJWT,getUserTweets)

export default router;