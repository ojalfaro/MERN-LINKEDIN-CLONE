import {mailtrapclient,sender} from '../database/mailtrap.js'
import { createCommentNotificationEmailTemplate, createWelcomeEmailTemplate } from './emailTemplates.js'


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

export const sendCommentNotificationEmail = async(recipientEmail,recipientName,commentName,postUrl,commentContent) => {
    const recipient = [{email}]
    try {
        const response = await mailtrapclient.send({
            from:sender,
            to:recipient,
            subject:"New comment on your post",
            html:createCommentNotificationEmailTemplate(recipientName,commentName,postUrl,commentContent),
            category:"comment_notification",
        })
        console.log("Comment notification Email sent successsfully")
    } catch (error) {
        throw error
    }
}
