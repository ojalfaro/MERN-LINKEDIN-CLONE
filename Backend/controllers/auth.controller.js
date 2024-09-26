import User from "../models/user.model.js"


export const signup = async (req,res) => {
    try{
        const {name,username,email,password} = req.body
        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({
                success:false,
                message:"Email already exists"
            })
        }

    }
    catch(error){

    }

}

export const login = (req,res) => {
    res.send("login")
}

export const logout = (req,res) => {
    res.send("logout")
}