import express from 'express'
import dotenv from 'dotenv'
import authRoute from './routes/auth.route.js'
import { ConnectDB } from './database/db.database.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())//parse JSON request bodies

app.use("/api/v1/auth",authRoute)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
   // ConnectDB()
})