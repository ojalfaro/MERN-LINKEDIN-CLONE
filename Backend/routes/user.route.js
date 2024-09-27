import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getSuggestionConnections,getPublicProfile,updateProfile } from "../controllers/user.controller.js";

const router = Router()

router.get("/suggestions",protectRoute,getSuggestionConnections)
router.get("/:username",protectRoute,getPublicProfile)

router.put("/profile",protectRoute,updateProfile)


export default router