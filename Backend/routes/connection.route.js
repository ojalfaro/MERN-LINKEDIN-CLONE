import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { sendConnectionRequest,acceptConnectionRequest,rejectConnectionRequest,getConnectionRequest,getUserConnectionRequest,removeConnection,getConnectionStatus } from "../controllers/connection.controller.js";


const router = Router()

router.post("/request/:userId",protectRoute,sendConnectionRequest)
router.put("/accept/:requestId",protectRoute,acceptConnectionRequest)
router.put("/reject/:requestId",protectRoute,rejectConnectionRequest)
//get all connection request for the current user
router.get("/requests",protectRoute,getConnectionRequest)
//get all connection for the user
router.get("/",protectRoute,getUserConnectionRequest)
router.delete("/:userId",protectRoute,removeConnection)
router.get("/status/:userId",protectRoute,getConnectionStatus)



export default router;