import express from 'express'
import dotenv from 'dotenv'
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import notificationRoute from './routes/notification.route.js'
import connectionRoute from './routes/connection.route.js'
import { ConnectDB } from './database/db.database.js'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json({limit:"5mb"}))//parse JSON request bodies
app.use(cookieParser())

app.use("/api/v1/auth",authRoute)
app.use("/api/v1/users",userRoute)
app.use("/api/v1/posts",postRoute)
app.use("/api/v1/notifications",notificationRoute)
app.use("/api/v1/connections",connectionRoute)




app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
    ConnectDB()
})