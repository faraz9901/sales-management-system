import { Router } from 'express'
import { getCurrentUser, loginUser } from '../controllers/user.controller.js'
import { verifyUser } from '../middlewares/verifyUser.js'


const router = Router()

router.post('/login', loginUser)

router.get('/current-user', verifyUser, getCurrentUser)

export default router