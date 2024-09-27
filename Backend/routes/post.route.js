import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getFeedPost,cretePost ,deletePost,getPostById,createComment,likePost} from '../controllers/post.controller.js'

const router = Router()

router.get("/",protectRoute,getFeedPost)
router.post("/create",protectRoute,cretePost)
router.delete("/delete/:id",protectRoute,deletePost)
router.get("/:id",protectRoute,getPostById)
router.post("/:id/coment",protectRoute,createComment)
router.post("/:id/like",protectRoute,likePost)





export default router