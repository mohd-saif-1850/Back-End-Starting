import { Router } from "express";
import verifyJWT from "../middlewares/auth.controller.js"
import { createComment, deleteComment, updateComment, userComments } from "../controllers/comment.controller.js";

const router = Router()

    router.route("/create-comment").post(verifyJWT,createComment)
    router.route("/update-comment").patch(verifyJWT,updateComment)
    router.route("/delete-comment").delete(verifyJWT,deleteComment)
    router.route("/user-comments").get(verifyJWT,userComments)

export default router;