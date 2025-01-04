import express from 'express'
import cors from 'cors'
import { env, connectToDatabase } from './utils/index.js'
import salesRouter from './routes/sales.routes.js'
import userRouter from './routes/users.routes.js'
import cookies from 'cookie-parser'
import { verifyUser } from './middlewares/verifyUser.js'

const PORT = env.PORT || 8000

const app = express()

app.use(express.json())
app.use(cookies())

app.use(cors({
    origin: env.ALLOWED_ORIGIN, // Allow requests from this origin
    credentials: true // Allow credentials (cookies, authorization headers)
}))


app.use('/api/v1/sales', verifyUser, salesRouter)

app.use('/api/v1/users', userRouter)

app.listen(PORT, () => {
    console.log(`Server Started at http://localhost:${PORT}`)
    connectToDatabase()
})