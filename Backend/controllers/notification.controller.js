import Notification from "../models/notification.model.js"

export const getUserNotications = async(req,res) => {
   
    try{
        const notifications = Notification.find({recipient:req.user._id }).short({createdAt:-1})
        .populate("relatedUser","name username profilePicture")
        .populate("reltedPost","content image")
        

        res.status(200).json(notifications)
    }
    catch(error){
        console.error("Error in getFeedPost controller: ",error.message)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const markNoticationAsRead = async(req,res) => {
    try{
        const notificacionId = req.params.id
        const notification = Notification.find(
            {_id: notificacionId ,recipient:req.user._id},
            { read:true},
            {new:true}
        )
        

        res.status(200).json(notification)
    }
    catch(error){
        console.error("Error in getFeedPost controller: ",error.message)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
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
        console.error("Error in getFeedPost controller: ",error.message)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

