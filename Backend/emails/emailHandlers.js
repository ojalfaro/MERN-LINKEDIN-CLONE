import {mailtrapclient,sender} from '../database/mailtrap.js'
import { createWelcomeEmailTemplate } from './emailTemplates.js'


export const sendWelcomeEmail = async(email,name,profileUrl) => {

    const recipient = [{email}]

    try{
        const response = await mailtrapclient.send({
            from:sender,
            to:recipient,
            subject:"Welcome to Unlinked",
            html: createWelcomeEmailTemplate(name,profileUrl),
            category: "Welcome"
        })

        console.log("Welcome Email sent successfully",response)
    }
    catch(error){
        throw error
    }


}

