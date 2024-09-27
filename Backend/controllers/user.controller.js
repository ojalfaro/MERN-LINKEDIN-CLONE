import User from "../models/user.model.js"
import cloudinary from "../utils/cloudinary.js"

export const getSuggestionConnections = async (req,res) => {
    const {userid} = req.user._id
    try{
        const currentUser = await User.findById(userid).select("connections")
        //find users who are not already connected, and also do not recomended our own profile! right?
        const suggestionsUser = await User.find({
            _id:{
                $ne: userid,$nin: currentUser.connections
            }
        }).select("name username profilePicture,headline")
        .limit(3)

        res.json(suggestionsUser)
    }
    catch(error){
        console.error("Error in suggestionsUser controller: ",error.message)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const getPublicProfile = async (req,res) => {
    const {username} = req.params.username
    try{
        const user = await User.findOne({username:username}).select("-password")

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        res.json(user)
    }catch(error){
        console.error("Error in getPublicProfile controller: ",error.message)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}


export const updateProfile = async (req,res) => {
    //const {username} = req.params.username
    try{
        const allowedFields = [
            "name",
            "username",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education",
        ]

        const updateData = {}

        for(const field of allowedFields){
            if(req.body[field]){
                updateData[field] = req.body[field]
            }
        }

        if(req.body.profilePicture){
            const result = await cloudinary.uploader.upload(req.body.profilePicture)
            updateData.profilePicture = result.secure_url
        }

        if(req.body.bannerImg){
            const result = await cloudinary.uploader.upload(req.body.bannerImg)
            updateData.bannerImg = result.secure_url
        }

        //todo check for the profile img and banner img
        const user = await User.findByIdAndUpdate(req.user._id,{$set: updateData},{new:true}).select("-password")
        res.json(user)

    }catch(error){

    }
}