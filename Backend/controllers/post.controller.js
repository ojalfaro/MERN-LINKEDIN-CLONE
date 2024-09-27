import Notification from "../models/notification.model.js"
import Post from "../models/post.model.js"
import cloudinary from "../utils/cloudinary.js"


export const getFeedPost = async(req,res) => {

    try{
        const posts = await Post.find({author:{$in: req.user.connections}})
        .populate("auhtor","name username profilePicture headline")
        .populate("comments.user","name profilePicture")
        .short({createdAt:-1})

        res.status(200).json(posts)
    }
    catch(error){
        console.error("Error in getFeedPost controller: ",error.message)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const cretePost = async(req,res) => {

    try{
        const {content,image} = req.body

        let newPost

        if(image){
            const imgResult = await cloudinary.uploader.upload(image)
            newPost = new Post({
                author: req.user._id,
                content,
                image:imgResult.secure_url
            })
        }else{
            newPost = new Post({
                author: req.user._id,
                content
            })
        }

        await newPost.save()

        res.status(201).json({
            success:true,
            message:newPost
        })
    }
    catch(error){
        console.error("Error in getFeedPost controller: ",error.message)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const deletePost = async(req,res) => {

    try{
        const postId = req.params.id
        const userId = req.user._id

        const post = await Post.findById(postId)

        if(!post){
            res.status(200).json({
                success:false,
                message:"Post not found"
            })
        }
        //checj if the current user is the author of the post
        if(post.author.toString() !== userId.toString()){
            res.status(403).json({
                success:false,
                message:"You are not authorized to delete this post"
            })
        }

        //delete the image from cloudinary as well
        if(post.image){
            //todo: do this later
            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0])
        }
        await Post.findByIdAndDelete(postId)
        res.status(200).json({
            success:true,
            message:"Post deleted successfully"
        })

    }
    catch(error){
        console.error("Error in deletePost controller: ",error.message)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const getPostById = async(req,res) => {
    try{
        const postId = req.params.id
       

        const post = await Post.findById(postId)
        .populate("auhtor","name username profilePicture headline")
        .populate("comments.user","name profilePicture")
        .short({createdAt:-1})
       
    
        res.status(200).json(post)

    }
    catch(error){
        console.error("Error in getPostById controller: ",error.message)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const createComment = async(req,res) => {
    try{
        const postId = req.params.id
        const { content } = req.body


        const posts = await Post.findByIdAndUpdate({
            $push: {cooments: {user: req.user._id,content}},
        },{new: true}).populate("auhtor","name email username profilePicture headline")

        //create a notification if the comment owner is not the post owner
        if(posts.author.toString() !== req.user._id.toString()){
            const newNotification = new Notification({
                recipient:post.author,
                type:"comment",
                relationUser:req.user._id,
                relatedPost:postId
            })
            await newNotification.save()
            //todo send email
            try {
                
            } catch (error) {
                
            }
        }

       


        res.status(200).json(posts)
    }
    catch(error){
        console.error("Error in getFeedPost controller: ",error.message)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}
