import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserNotications,markNoticationAsRead,deleteNotication} from '../controllers/notification.controller.js'


const router = Router()

router.get("/",protectRoute,getUserNotications)
router.put("/:id/read",protectRoute,markNoticationAsRead)
router.delete("/:id",protectRoute,deleteNotication)






export default router