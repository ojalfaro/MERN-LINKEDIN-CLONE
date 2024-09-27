import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendWelcomeEmail } from "../emails/emailHandlers.js"


export const signup = async (req,res) => {
    try{
        const {name,username,email,password} = req.body

        if(!name || !username ||!email ||!password ){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({
                success:false,
                message:"Email already exists"
            })
        }
        const existingUsername = await User.findOne({username})
        if(existingUsername){
            return res.status(400).json({
                success:false,
                message:"Username already exists"
            })
        }

        if(password.length < 6){
            return res.status(400).json({
                success:false,
                message:"Password must be at least 6 characters"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const user = new User({
            name,
            email,
            password:hashedPassword,
            username
        })

        await user.save()

        const token = jwt.sign( {userId:user._id }, process.env.JWT_SECRET , {expiresIn:"3d"})

        res.cookie("jwt-linkedin",token ,{
            httpOnly:true, //prevent xss attack
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite:"strict",//prevent CSRF attacks
            secure:process.env.NODE_ENV==="production",//prevent man-in-the-middle attaks
        })

        res.status(201).json({
            success:true,
            message:"User registered successfully"
        })

        //todo: send welcome email
        const profileUrl = process.env.CLIENT_URL + "/profile/"+user.username

        try{ 
            await sendWelcomeEmail(user.email,user.name,profileUrl)
        }
        catch(emailError){
            console.error("Error sending Welcome Email",emailError)
        }
    }
    catch(error){
        console.log("Error in signup: ",error.message)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }

}

export const login = async (req,res) => {
    try{
        const {username,password} = req.body

        if( !username ||!password ){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const existingUsername = await User.findOne({username})
        if(!existingUsername){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }

        const isMatch = await User.findOne({username})
        if(!existingUsername){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }

        const user = new User({
            name,
            email,
            password:hashedPassword,
            username
        })

        await user.save()

        const token = jwt.sign( {userId:user._id }, process.env.JWT_SECRET , {expiresIn:"3d"})

        res.cookie("jwt-linkedin",token ,{
            httpOnly:true, //prevent xss attack
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite:"strict",//prevent CSRF attacks
            secure:process.env.NODE_ENV==="production",//prevent man-in-the-middle attaks
        })

        res.status(201).json({
            success:true,
            message:"User registered successfully"
        })

        //todo: send welcome email
        const profileUrl = process.env.CLIENT_URL + "/profile/"+user.username

        try{ 
            await sendWelcomeEmail(user.email,user.name,profileUrl)
        }
        catch(emailError){
            console.error("Error sending Welcome Email",emailError)
        }
    }
    catch(error){
        console.log("Error in signup: ",error.message)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }

}

export const logout = (req,res) => {
    res.clearCookie("jwt-linkedin")
    res.json({message:"Logout out successfully"})
}