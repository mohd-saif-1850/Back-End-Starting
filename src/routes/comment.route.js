import { Router } from "express";
import verifyJWT from "../middlewares/auth.controller.js"
import { createComment, updateComment } from "../controllers/comment.controller.js";

const router = Router()

    router.route("/create-comment").post(verifyJWT,createComment)
    router.route("/update-comment").patch(verifyJWT,updateComment)


export default router;