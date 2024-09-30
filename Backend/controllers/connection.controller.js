import { sendConnectionAcceptedEmail } from "../emails/emailHandlers.js"
import ConnectionRequest from "../models/connectionRequest.model.js"
import Notification from "../models/notification.model.js"
import User from "../models/user.model.js"


export const sendConnectionRequest = async(req,res) => {
    try{
        const {userId} = req.params
        const senderId = req.user._id

        if(senderId.toString() ===userId){
            return res.status(400).json({message:"you can´t send request to yourself"})
        }
        if(req.user.connnection.includes(userId)){
            return res.status(400).json({message:"you are already connected"})
        }

        const existingRequest = await ConnectionRequest.findOne({
            sender:senderId,
            recipient: userId,
            status: "pending",
        })

        if(existingRequest){
            return res.status(400).json({message:"A connection request already exists"})
        }

        const newRequest = new ConnectionRequest({
            sender: senderId,
            recipient: userId
        })

        await newRequest.save()

        res.status(201).json({message: "Connection request sent successfully"})

    }catch(error){
        res.status(500).json({message: "Server error"})
    }
}

export const acceptConnectionRequest = async(req,res) => {
    try {
        const {requstId} = req.params
        const userId = req.user._id

        const request = await ConnectionRequest.findById(requstId)
        .populate("sender" ,"name email username")
        .populate("recipient", "name username")
        
        if(!request){
            return res.status(400).json({message:"Connetion request not found"})
        }

        //check if the req is for the current user
        if(request.recipient._id.toString() !== userId.toString()){
            return res.status(400).json({message:"Not autorized to accept this request"})
        }

        if(request.status !== "pending"){
            return res.status(400).json({message:"This resquest has already been proceseed"})
        }

        request.status = "accepted"
        await request.save()

        //if in your friend then ur also my friend  ;)
        await User.findByIdAndUpdate(request.sender._id,{$addToSet: {connections: userId}})
        await User.findByIdAndUpdate(userId,{$addToSet: {connections: request.sender._id}})

        const notificacion = new Notification({
            recipient:request.sender._id,
            type:"connectionAccepted",
            relatedUser: userId
        })

        await notificacion.save()

        res.json({message:"Connection accepted successfully"})

        //todo: send email
        const sendEmail = request.sender.email
        const senderName = request.sender.senderName
        const recipientName = request.recipient.senderName
        const profileUrl = process.env.CLIENT_URL + "/profile/" + request.recipient.username

        try {
            await sendConnectionAcceptedEmail(sendEmail,senderName,recipientName,profileUrl)
        } catch (error) {
            
        }

    } catch (error) {
        console.error("Error in acceptConnectionRequest controller: ",error)
        res.status(500).json({message: "Server error"})
    }
}

export const rejectConnectionRequest = async(req,res) => {
    try {
		const { requestId } = req.params;
		const userId = req.user._id;

		const request = await ConnectionRequest.findById(requestId);

		if (request.recipient.toString() !== userId.toString()) {
			return res.status(403).json({ message: "Not authorized to reject this request" });
		}

		if (request.status !== "pending") {
			return res.status(400).json({ message: "This request has already been processed" });
		}

		request.status = "rejected";
		await request.save();

		res.json({ message: "Connection request rejected" });
	} catch (error) {
		console.error("Error in rejectConnectionRequest controller:", error);
		res.status(500).json({ message: "Server error" });
	}

}

export const getConnectionRequest = async(req,res) => {
    try {
        const userId = req.user._id

        const requests = await ConnectionRequest.find({recipient:userId,status:"pending"}).populate(
            "sender",
            "name username profilePicture headline connnections"
        )
        res.json(requests)
        
    } catch (error) {
        console.error("Error in getConnectionRequest controller:", error);
		res.status(500).json({ message: "Server error" });
    }

}

export const getUserConnectionRequest = async(req,res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId).populate(
            "connnections",
            "name username profilePicture headline connnections"
        )

        res.json(user.connections)
        
    } catch (error) {
        console.error("Error in getUserConnectionRequest controller:", error);
		res.status(500).json({ message: "Server error" });
    }
}

export const removeConnection = async(req,res) => {
    try {
        const myId = req.user._id
        const {userId} = req.params

        await User.findByIdAndUpdate(myId,{$pull: {connections:userId}})
        await User.findByIdAndUpdate(userId,{$pull: {connections:myId}})

        
        res.json({message:"Connection removed successfully"})
        
    } catch (error) {
        console.error("Error in removeConnection controller:", error);
		res.status(500).json({ message: "Server error" });
    }
}

export const getConnectionStatus = async(req,res) => {
    try {
        const targetUserId = req.params.userId
        const currentUserId = req.user._id 

        const currendUser = req.user

        if(currendUser.connections.includes(targetUserId)){
            return res.json({status: "connected"})
        }

        const pendingRequest = await ConnectionRequest.findOne({
            $or:[
                {sender: currentUserId,recipient:targetUserId,},
                {sender:targetUserId,recipient:currentUserId}
            ],
            status:"pending"
        })

        if(pendingRequest){
            if(pendingRequest.sender.toString() === currentUserId.toString()){
                return res.json({status:"pending"})
            }else{
                return res.json({status:"received"})
            }
        }

        //if no connection or pending req found
        res.json({status:"not_connected"})
        
    } catch (error) {
        console.error("Error in getConnectionStatus controller:", error);
		res.status(500).json({ message: "Server error",requestId:pendingRequest._id });
    }
}
