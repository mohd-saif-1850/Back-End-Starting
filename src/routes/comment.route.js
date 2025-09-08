import { Router } from "express";
import verifyJWT from "../middlewares/auth.controller.js"
import { createComment } from "../controllers/comment.controller.js";

const router = Router()

    router.route("/create-comment").post(verifyJWT,createComment)


export default router;