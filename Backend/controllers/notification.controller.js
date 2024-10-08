import Notification from "../models/notification.model.js"

export const getUserNotications = async(req,res) => {
   
    try {
		const notifications = await Notification.find({ recipient: req.user._id })
			.sort({ createdAt: -1 })
			.populate("relatedUser", "name username profilePicture")
			.populate("relatedPost", "content image");

		res.status(200).json(notifications);
	} catch (error) {
		console.error("Error in getUserNotifications controller:", error);
		res.status(500).json({ message: "Internal server error" });
	}
    
   
}

export const markNoticationAsRead = async(req,res) => {
    const notificationId = req.params.id;
	try {
		const notification = await Notification.findByIdAndUpdate(
			{ _id: notificationId, recipient: req.user._id },
			{ read: true },
			{ new: true }
		);

		res.json(notification);
	} catch (error) {
		console.error("Error in markNotificationAsRead controller:", error);
		res.status(500).json({ message: "Internal server error" });
	}
}

export const deleteNotication = async(req,res) => {
    try{
        const notificacionId = req.params.id
        await Notification.findByIdAndDelete(
            {_id: notificacionId ,recipient:req.user._id},
        )
        

        res.status(200).json({message:"Notification deleted successfully"})
    }
    catch(error){
        console.error("Error in deleteNotication controller: ",error.message)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

